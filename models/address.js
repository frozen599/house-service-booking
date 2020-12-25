'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    name: DataTypes.STRING,
    email: DataTypes.TEXT,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    district: DataTypes.TEXT
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    Address.hasMany(models.Order);
    Address.belongsTo(models.User);
  };
  return Address;
};