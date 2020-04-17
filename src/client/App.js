import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "../assets/css/style.css";
import Feed from "./Feed";
import Feed2 from "./Feed2";

const posts = [
  {
    id: 2,
    text: "Lorem ipsun",
    user: {
      avatar: "/uploads/avatar1.png",
      username: "Test User",
    },
  },
  {
    id: 1,
    text: "Lorem ipsun",
    user: {
      avatar: "/uploads/avatar2.png",
      username: "Test User",
    },
  },
];

export default class App extends Component {
  state = {
    posts: posts,
    postContent: "",
  };

  handlePostContentChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      id: this.state.posts.length + 1,
      text: this.state.postContent,
      user: {
        avatar: "/uploads/avatar1.png",
        username: "Fake User",
      },
    };

    this.setState((prevState) => ({
      posts: [newPost, ...prevState.posts],
      postContent: "",
    }));
  };

  render() {
    const { posts, postContent } = this.state;
    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="descripcion"
            content="Newsfeed of all your friends on Graphbook"
          />
        </Helmet>
        <Feed2 />
      </div>
    );
  }
}
