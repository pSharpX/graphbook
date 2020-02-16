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

    return queryInterface.sequelize
      .query("SELECT id FROM Users")
      .then(users => {
        const userRows = users[0];
        return queryInterface.bulkInsert(
          "Posts",
          [
            {
              text: "Lorem ipsum 1",
              userId: userRows[0].id,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              text: "Lorem ipsum 2",
              userId: userRows[1].id,
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

    return queryInterface.bulkDelete("Posts", null, {});
  }
};
