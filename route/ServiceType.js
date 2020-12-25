var express = require('express');
var router = express.Router();

var serviceTypeController = require('../controllers/ServiceType');
var serviceController = require('../controllers/Service')

router.get('/', function (req, res) {
    res.redirect('/servicetype');
});

router.get('/servicetype', function (req, res) {
    serviceTypeController.getAll(function (serviceTypes) {
        serviceController.getAll(function (services) {
            res.locals.serviceTypes = serviceTypes;
            res.locals.services = services;
            res.render('index');
        })
    });
});

router.get('/servicetype/:id', function (req, res) {
    serviceTypeController.getById(req.params.id, function (serviceType) {
        serviceController.getByServiceTypeId(req.params.id, function (services) {
            res.locals.ServiceTypeId = req.params.id;
            res.locals.serviceType = serviceType;
            res.locals.services = services;
            res.render('service');
        });
    })
});

module.exports = router;