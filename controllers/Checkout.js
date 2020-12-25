var controller = {};
var sequelize = require('sequelize');
var Op = sequelize.Op;

var models = require('../models');
var Address = models.Address;

module.exports = controller;