"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "Posts",
          "userId",
          {
            type: Sequelize.INTEGER
          },
          { transaction: t }
        ),
        queryInterface.addConstraint(
          "Posts",
          ["userId"],
          {
            type: "foreign key",
            name: "fk_user_id",
            references: {
              table: "Users",
              field: "id"
            },
            onUpdate: "cascade",
            onDelete: "cascade"
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([queryInterface.removeColumn("Posts", "userId")]);
  }
};
