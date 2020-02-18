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
      queryInterface.sequelize.query("SELECT id FROM users;", {
        type: Sequelize.QueryTypes.SELECT
      }),
      queryInterface.sequelize.query("SELECT id FROM chats;", {
        type: Sequelize.QueryTypes.SELECT
      })
    ]);
    return usersAndChats.then(rows => {
      const users = rows[0];
      const chats = rows[1];
      return queryInterface.bulkInsert(
        "users_chats",
        [
          {
            userId: users[0].id,
            chatId: chats[0].id,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            userId: users[1].id,
            chatId: chats[0].id,
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
    return queryInterface.bulkDelete("users_chats", null, {});
  }
};
