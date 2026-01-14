'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      cus_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      cus_full_name: Sequelize.STRING,
      cus_email: {
        type: Sequelize.STRING,
        unique: true,
      },
      cus_phone: Sequelize.STRING,
      cus_address: Sequelize.STRING,
      image_path: Sequelize.STRING,
      userId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references:{
          model:"Users",
          key:"userId"
        },
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {engine : 'InnoDB'});
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Customers');
  }
};