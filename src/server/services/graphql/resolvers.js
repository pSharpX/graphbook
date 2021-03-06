import logger from "../../helpers/logger";

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
      },
    },
    Chat: {
      lastMessage(chat, args, context) {
        return chat
          .getMessages({ limit: 1, order: [["id", "DESC"]] })
          .then((message) => message[0]);
      },
      messages(chat, args, context) {
        return chat.getMessages({ order: [["id", "ASC"]] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [["createdAt", "DESC"]] });
      },
      postsFeed(root, { page, limit }, context) {
        var skip = 0;

        if (page && limit) {
          skip = page * limit;
        }
        var query = {
          order: [["createdAt", "DESC"]],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }
        return {
          posts: Post.findAll(query),
        };
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) return [];
          const userRow = users[0];
          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: {
                  where: {
                    userId: userRow.id,
                  },
                },
              },
              {
                model: Message,
              },
            ],
          });
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({ level: "info", message: "Post will be created !" });
        return User.findAll().then((users) => {
          const userRow = users[0];
          return Post.create({
            ...post,
          }).then((newPost) => {
            logger.log({ level: "info", message: "Post was created !" });
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 5000);
            }).then(() => {
              return Promise.all([newPost.setUser(userRow.id)]).then(
                () => newPost
              );
            });

            // return Promise.all([newPost.setUser(userRow.id)]).then(
            //   () => newPost
            // );
          });
        });
      },
      addChat(root, { chat }, context) {
        logger.log({ level: "info", message: "Chat was created !" });
        return Chat.create().then((newChat) => {
          return Promise.all([newChat.setUsers(chat.users)]).then(
            () => newChat
          );
        });
      },
      addMessage(root, { message }, context) {
        logger.log({ level: "info", message: "Message was created !" });
        return User.findAll().then((users) => {
          const userRow = users[0];
          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(userRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => newMessage);
          });
        });
      },
    },
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
  };
  return resolvers;
}
