'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      brand: {
        type: Sequelize.STRING
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      sale_price: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      display: {
        type: Sequelize.STRING
      },
      os: {
        type: Sequelize.STRING
      },
      main_camera: {
        type: Sequelize.STRING
      },
      selfi_camera: {
        type: Sequelize.STRING
      },
      chip: {
        type: Sequelize.STRING
      },
      Ram: {
        type: Sequelize.STRING
      },
      Rom: {
        type: Sequelize.STRING
      },
      battery: {
        type: Sequelize.STRING
      },
      priority: {
        type: Sequelize.STRING
      },
      num_quantity: {
        type: Sequelize.STRING
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};