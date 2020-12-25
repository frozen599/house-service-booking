var controller = {};

var models = require('../models');

controller.getAll = function (callback) {
    models.Address
        .findAll()
        .then(function (addresses) {
            callback(addresses);
        });
};

controller.add = function (address, callback) {
    models.Address
        .create(address)
        .then(callback)
        .catch(function (err) {
            console.log(err);
        })
}

module.exports = controller;

var controller = {};

var models = require('../models');

controller.getAll = function (callback) {
    models.Address
        .findAll()
        .then(function (addresses) {
            callback(addresses);
        });
};

controller.add = function (address, callback) {
    models.Address
        .create(address)
        .then(callback)
        .catch(function (err) {
            console.log(err);
        })
}

module.exports = controller;
