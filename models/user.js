'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Customer,{
        foreignKey : "userId",
        as : "customer",
      });
    }
  }
  
  User.init({
    userId: {
      type : DataTypes.STRING,
      primaryKey: true,  
    },
    username:{
      type : DataTypes.STRING,
      allowNull: false,
      unique : true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type: DataTypes.ENUM("ADMIN", "CUSTOMER"),
        allowNull: false,
    },
    token:{
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.userId = `USER${Math.floor(100000 + Math.random() * 900000)}`;
      },
    },
  });
  return User;
};