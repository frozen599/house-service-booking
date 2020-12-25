var express = require('express');
var router = express.Router();

var serviceController = require('../controllers/Service');
var userController = require('../controllers/user');

router.delete('/:id', function (req, res) {
    var id = req.params.id;
    serviceController.delete(id, function () {
        res.sendStatus(204);
        res.end();
    });
});

router.put('/:id', function (req, res) {
    var service = {
        id: req.params.id,
        price: req.body.price
    };

    serviceController.update(service, function () {
        res.sendStatus(204);
        res.end();
    });
});

router.get('/:id', function (req, res) {
    serviceController.getById(req.params.id, function (service) {
        res.locals.service = service;
        res.render('detail');
    });
});

router.post('/search', function (req, res) {
    var id = req.body.id;
    var timeStart = req.body.timeStart;
    var dateStart = '';
    dateStart = req.body.dateStart;

    var timeNow = new Date();
    var _timeStart = new Date(dateStart);
    if(dateStart !='' && _timeStart < timeNow){
        console.log("Wrong date");
        dateStart = '';
    }
    console.log('timeStart: '+ timeStart);

    serviceController.getById(id, function (service) {
        res.locals.service = service;
        res.locals.timeStart = timeStart;
        res.locals.dateStart = dateStart;
        res.render('detail');
    })
})

module.exports = router;