'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    imagepath: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Order);
    User.hasMany(models.Address);
  };
  return User;
};