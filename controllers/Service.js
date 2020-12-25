var controller = {};
var sequelize = require('sequelize');
var Op = sequelize.Op;

var models = require('../models');
var Services = models.Service;

controller.add = function (service, callback) {
    Services.create(service)
        .then(callback)
        .catch(function (err) {
            console.log(err);
        });
};

controller.getAll = (callback) => {
    Services.findAll()
        .then((services) => {
            callback(services);
        });
};

controller.getById = function (id, callback) {
    Services.findOne({
        where: {
            id: id
        }
    })
        .then(function (service) {
            callback(service);
        });
};

controller.getByServiceTypeId = function (id, callback) {
    Services.findAll(
        {
            where: {
                ServiceTypeId: id
            }
        }
    )
        .then(function (services) {
            callback(services);
        });
};

controller.update = function (service, callback) {
    Services.update(
        {
            price: service.price
        },
        {
            where: { id: service.id }
        }
    ).then(callback);
};

controller.delete = function (id, callback) {
    Services.destroy({
        where: {
            id: id
        }
    }).then(callback);
};

module.exports = controller;