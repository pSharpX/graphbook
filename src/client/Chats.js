import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import "../assets/css/style.css";

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

const GET_CHAT = gql`
  query($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`;

export default class Chats extends Component {
  state = {
    openChats: [],
  };

  usernamesToString = (users) => {
    const userList = users.slice(1);
    var usernamesString = "";
    for (let index = 0; index < userList.length; index++) {
      usernamesString += userList[index].username;
      if (index - 1 === userList.length) usernamesString += ", ";
    }
    return usernamesString;
  };

  shorten = (text) => {
    if (text.length > 12) return text.substring(0, text.length - 9) + "...";
    return text;
  };

  openChat = (chatId) => {
    return () => {
      var openChats = this.state.openChats.slice();
      if (openChats.indexOf(chatId) === -1) {
        if (openChats.length > 2) openChats = openChats.slice(1);
        openChats.push(chatId);
      }
      this.setState({ openChats });
    };
  };

  closeChat = (chatId) => {
    return () => {
      var openChats = this.state.openChats.slice();
      const index = openChats.indexOf(chatId);
      openChats.splice(index, 1);
      this.setState({ openChats });
    };
  };

  render() {
    const { openChats } = this.state;
    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return error.message;
              const { chats } = data;
              return chats.map((chat, i) => (
                <div
                  key={"chat" + chat.id}
                  className="chat"
                  onClick={this.openChat(chat.id)}
                >
                  <div className="header">
                    <img
                      src={
                        chat.users.length > 2
                          ? "/public/group.png"
                          : chat.users[1].avatar
                      }
                    />
                    <div>
                      <h2>
                        {this.shorten(this.usernamesToString(chat.users))}
                      </h2>
                      <span>
                        {chat.lastMessage &&
                          this.shorten(chat.lastMessage.text)}
                      </span>
                    </div>
                  </div>
                </div>
              ));
            }}
          </Query>
        </div>
        <div className="openChats">
          {openChats.map((chatId, index) => (
            <Query
              key={"chatWindow" + chatId}
              query={GET_CHAT}
              variables={{ chatId }}
            >
              {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return error.message;
                const { chat } = data;
                return (
                  <div className="chatWindow">
                    <div className="header">
                      <span>{chat.users[1].username}</span>
                      <button
                        className="close"
                        onClick={this.closeChat(chat.id)}
                      >
                        X
                      </button>
                    </div>
                    <div className="messages">
                      {chat.messages.map((message, j) => (
                        <div
                          key={"message" + message.id}
                          className={
                            "message " +
                            (message.user.id > 1 ? "left" : "right")
                          }
                        >
                          {message.text}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </Query>
          ))}
        </div>
      </div>
    );
  }
}
