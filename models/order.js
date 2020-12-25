'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    totalQuantity: DataTypes.INTEGER,
    totalPrice: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.OrderDetail);
    Order.belongsTo(models.Address);
    Order.belongsTo(models.User);
  };
  return Order;
};