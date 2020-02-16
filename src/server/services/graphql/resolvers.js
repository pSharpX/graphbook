import logger from "../../helpers/logger";

let posts = [
  {
    id: 2,
    text: "Lorem ipsun",
    user: {
      avatar: "/uploads/avatar1.png",
      username: "Test User"
    }
  },
  {
    id: 1,
    text: "Lorem ipsun",
    user: {
      avatar: "/uploads/avatar2.png",
      username: "Test User"
    }
  }
];

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;
  const resolvers = {
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      }
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [["id", "ASC"]] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      }
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [["createdAt", "DESC"]] });
      },
      chats(root, args, context) {
        return User.findAll().then(users => {
          if (!users.length) return [];
          const userRow = users[0];
          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: {
                  where: {
                    userId: userRow.id
                  }
                }
              },
              {
                model: Message
              }
            ]
          });
        });
      }
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({ level: "info", message: "Post was created !" });
        return User.findAll().then(users => {
          const userRow = users[0];
          return Post.create({
            ...post
          }).then(newPost => {
            return Promise.all([newPost.setUser(userRow.id)]).then(
              () => newPost
            );
          });
        });
      }
    },
    Post: {
      user(post, args, context) {
        return post.getUser();
      }
    }
  };
  return resolvers;
}
