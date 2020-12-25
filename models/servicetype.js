'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServiceType = sequelize.define('ServiceType', {
    imagepath: DataTypes.TEXT,
    title: DataTypes.STRING,
    des1: DataTypes.STRING,
    des2: DataTypes.STRING,
    des3: DataTypes.STRING
  }, {});
  ServiceType.associate = function(models) {
    // associations can be defined here
    ServiceType.hasMany(models.Service);
  };
  return ServiceType;
};