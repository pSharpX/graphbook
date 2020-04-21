import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "../assets/css/style.css";
import Feed from "./Feed";
import Feed2 from "./Feed2";
import Chats from "./Chats";

export default class App extends Component {
  state = {};

  render() {
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
