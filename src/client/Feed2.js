import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import InfiniteScroll from "react-infinite-scroller";
import gql from "graphql-tag";
import "../assets/css/style.css";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

export default class Feed2 extends Component {
  state = {
    postContent: "",
    hasMore: true,
    page: 0,
    limit: 10,
  };

  handlePostContentChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleSubmit = (addPost) => {
    return (event) => {
      event.preventDefault();
      addPost({ variables: { post: { text: this.state.postContent } } }).then(
        () => {
          this.setState((prevState) => ({
            postContent: "",
          }));
        }
      );
    };
  };

  loadMore = (fetchMore) => () => {
    const self = this;
    const { page } = this.state;
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        if (!fetchMoreResult.postsFeed.posts.length) {
          self.setState({ hasMore: false });
          return previousResult;
        }
        self.setState({ page: page + 1 });
        const newData = {
          postsFeed: {
            __typename: "PostFeed",
            posts: [
              ...previousResult.postsFeed.posts,
              ...fetchMoreResult.postsFeed.posts,
            ],
          },
        };
        return newData;
      },
    });
  };

  render() {
    const { postContent, hasMore, limit } = this.state;
    return (
      <div className="container">
        <div className="postForm">
          <Mutation
            // refetchQueries={[{ query: GET_POSTS }]}
            update={(store, { data: { addPost } }) => {
              const variables = {
                page: 0,
                limit,
              };
              const data = store.readQuery({
                query: GET_POSTS,
                variables,
              });
              data.postsFeed.posts.unshift(addPost);
              store.writeQuery({ query: GET_POSTS, variables, data });
            }}
            optimisticResponse={{
              __typename: "mutation",
              addPost: {
                __typename: "Post",
                text: postContent,
                id: -1,
                user: {
                  __typename: "User",
                  username: "Loading...",
                  avatar: "/public/loading.gif",
                },
              },
            }}
            mutation={ADD_POST}
          >
            {(addPost) => (
              <form onSubmit={this.handleSubmit(addPost)}>
                <textarea
                  value={postContent}
                  onChange={this.handlePostContentChange}
                  placeholder="Write your custom post !"
                ></textarea>
                <input type="submit" value="Submit" />
              </form>
            )}
          </Mutation>
        </div>
        <Query
          // pollInterval={5000}
          query={GET_POSTS}
          variables={{ page: 0, limit }}
        >
          {({ loading, error, data, fetchMore }) => {
            if (loading) return "Loading...";
            if (error) return error.message;
            const { postsFeed } = data;
            const { posts } = postsFeed;
            return (
              <div className="feed">
                <InfiniteScroll
                  loadMore={this.loadMore(fetchMore)}
                  hasMore={hasMore}
                  loader={
                    <div className="loader" key="loader">
                      Loading...
                    </div>
                  }
                >
                  {posts.map((post, i) => (
                    <div
                      key={post.id}
                      className={"post" + (post.id < 0 ? " optimistic" : "")}
                    >
                      <div className="header">
                        <img src={post.user.avatar} />
                        <h2>{post.user.username}</h2>
                      </div>
                      <p className="content">{post.text}</p>
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
