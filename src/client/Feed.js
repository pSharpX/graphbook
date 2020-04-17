import React, { Component } from "react";
import { flowRight as compose } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import "../assets/css/style.css";

const GET_POST = gql`
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

const GET_POST_QUERY = graphql(GET_POST, {
  props: ({ data: { loading, error, posts } }) => ({
    loading,
    error,
    posts,
  }),
});

const ADD_POST_MUTATION = graphql(ADD_POST, {
  name: "addPost",
});

class Feed extends Component {
  state = {
    postContent: "",
  };

  handlePostContentChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      text: this.state.postContent,
    };

    this.props.addPost({ variables: { post: newPost } }).then(() => {
      this.setState((prevState) => ({
        postContent: "",
      }));
    });
  };

  render() {
    const { posts, loading, error } = this.props;
    const { postContent } = this.state;
    if (loading) return "Loading...";
    if (error) return error.message;
    return (
      <div className="container">
        <div className="postForm">
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={postContent}
              onChange={this.handlePostContentChange}
              placeholder="Write your custom post !"
            ></textarea>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="feed">
          {posts.map((post, i) => (
            <div key={post.id} className="post">
              <div className="header">
                <img src={post.user.avatar} />
                <h2>{post.user.username}</h2>
              </div>
              <p className="content">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default compose(GET_POST_QUERY, ADD_POST_MUTATION)(Feed);
