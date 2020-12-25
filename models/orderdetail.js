'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    quantity: DataTypes.INTEGER,
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    timeStart: DataTypes.TIME,
    price: DataTypes.DECIMAL
  }, {});
  OrderDetail.associate = function(models) {
    // associations can be defined here
    OrderDetail.belongsTo(models.Order);
    OrderDetail.belongsTo(models.Service);
  };
  return OrderDetail;
};