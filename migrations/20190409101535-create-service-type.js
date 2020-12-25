'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServiceTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imagepath: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      des1: {
        type: Sequelize.STRING
      },
      des2: {
        type: Sequelize.STRING
      },
      des3: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServiceTypes');
  }
};