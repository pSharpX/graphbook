"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const usersAndChats = Promise.all([
      queryInterface.sequelize.query("SELECT id FROM users;"),
      queryInterface.sequelize.query("SELECT id FROM chats;")
    ]);

    return usersAndChats.then(([[users], [chats]]) => {
      const chat = chats[0];
      return queryInterface.bulkInsert(
        "Messages",
        [
          {
            userId: users[0].id,
            chatId: chat.id,
            text: "This is a text message",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            userId: users[1].id,
            chatId: chat.id,
            text: "This is a second text message",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            userId: users[1].id,
            chatId: chat.id,
            text: "This is a third text message",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Messages", null, {});
  }
};
