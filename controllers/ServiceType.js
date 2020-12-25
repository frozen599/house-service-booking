var controller = {};
var sequelize = require('sequelize');
var Op = sequelize.Op;

var models = require('../models');
var ServiceTypes = models.ServiceType;

controller.add = function (serviceType, callback) {
    ServiceTypes.create(serviceType)
        .then(callback)
        .catch(function (err) {
            console.log(err);
        });
};

controller.getAll = function (callback) {
    ServiceTypes.findAll()
        .then(function (serviceTypes) {
            callback(serviceTypes);
        });
};

controller.getById = function (id, callback) {
    ServiceTypes.findOne({
        where: {
            id: id
        },
        include: [models.Service]
    })
        .then(function (serviceType) {
            callback(serviceType);
        });
}

module.exports = controller;