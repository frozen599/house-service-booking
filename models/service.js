'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    imagepath: DataTypes.TEXT,
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {});
  Service.associate = function(models) {
    // associations can be defined here
    Service.belongsTo(models.ServiceType);
    Service.hasMany(models.OrderDetail);
  };
  return Service;
};