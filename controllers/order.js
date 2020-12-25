var controller = {};

var sequelize = require('sequelize');
var Op = sequelize.Op;

var models = require('../models');

//CSDL
//Address
//Prder
//OrderDetails

controller.saveOrderByAdmin = function (order, user, callback) {
	models.Address.create(order.address).then(function (newAddress) {
		var _order = {
			totalQuantity: order.quantity,
			totalPrice: order.totalPrice,
			paymentMethod: order.paymentMethod,
			status: order.status,
			AddressId: newAddress.id,
			UserId: user.id
		};

		models.Order.create(_order).then(function (newOrder) {
			var detail = {
				price: order.price,
				quantity: order.quantity,
				dateStart: order.dateStart,
				timeStart: order.timeStart,
				dateEnd: order.dateEnd,
				ServiceId: order.serviceId,
				OrderId: newOrder.id
			}

			models.OrderDetail.create(detail);
		});
		callback();
	});
};

controller.saveOrder = function (cart, user, callback) {
	models.Address.create(cart.address).then(function (newAddress) {
		var order = {
			totalQuantity: cart.totalQuantity(),
			totalPrice: cart.totalPrice(),
			paymentMethod: cart.paymentMethod,
			status: 'Processing',
			AddressId: newAddress.id,
			UserId: user.id
		};

		models.Order.create(order).then(function (newOrder) {
			var items = cart.generateArray();
			items.forEach(function (item) {
				var detail = {
					price: item.price,
					quantity: item.quantity,
					dateStart: item.item.dateStart,
					timeStart: item.item.timeStart,
					dateEnd: item.item.dateEnd,
					ServiceId: item.item.id,
					OrderId: newOrder.id
				};

				console.log('DateStart: ', detail.dateStart);
				console.log('\nDateEnd: ', detail.dateEnd);
				console.log('\ntimeStart: ', detail.timeStart);

				models.OrderDetail.create(detail);
			});

			//empty Cart
			cart.empty();
			callback();
		});
	});
};

controller.getByUser = function (user, callback) {
	models.Order
		.findAll({
			where: {
				UserId: user.id
			}
		})
		.then(function (orders) {
			callback(orders);
		});
};

controller.getDetailsByOrderId = function (id, callback) {
	models.OrderDetail
		.findAll({
			where: {
				OrderId: id
			},
			include: models.Service
		})
		.then(function (details) {
			details.forEach(function (detail) {
				detail.Service.price = parseInt(detail.Service.price);
			});
			callback(details);
		});
};

controller.getDetailsByDate = function (date, callback) {
	models.OrderDetail
		.findAll({
			where: {
				createdAt: {
					[Op.gte]: date
				}
			}
		})
		.then(function (details) {
			callback(details);
		});
}

controller.getById = function (id, callback) {
	models.Order
		.findOne({
			where: {
				id: id
			},
			include: models.Address
		})
		.then(function (order) {
			callback(order);
		});
};
module.exports = controller;
