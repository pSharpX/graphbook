import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import "../assets/css/style.css";

const GET_POSTS = gql`
  {
    posts {
      id
      text
      user {
        avatar
        username
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

  render() {
    const { postContent } = this.state;
    return (
      <div className="container">
        <div className="postForm">
          <Mutation
            // refetchQueries={[{ query: GET_POSTS }]}
            update={(store, { data: { addPost } }) => {
              const data = store.readQuery({ query: GET_POSTS });
              data.posts.unshift(addPost);
              store.writeQuery({ query: GET_POSTS, data });
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
        <div className="feed">
          <Query pollInterval={5000} query={GET_POSTS}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return error.message;
              const { posts } = data;
              return posts.map((post, i) => (
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
              ));
            }}
          </Query>
        </div>
      </div>
    );
  }
}
