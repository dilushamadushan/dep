'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.belongsTo(models.User,{
        foreignKey : "userId",
        as: "user",
      })
    }
  }
  Customer.init({
    cus_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      cus_full_name: DataTypes.STRING,
      cus_email: {
        type: DataTypes.STRING,
        unique: true,
      },
      cus_phone: DataTypes.STRING,
      cus_address: DataTypes.STRING,

      image_path: {
        type: DataTypes.STRING,
      },

      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Customer',
    hooks: {
        beforeCreate: (customer) => {
          customer.cus_id = `CUS${Math.floor(100000 + Math.random() * 900000)}`;
        },
    },
  });
  return Customer;
};