var express = require('express');
var router = express.Router();

var paypal = require('paypal-rest-sdk');
const usd = 22000;

//paypal configuration
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARt-UNs5DlNcZ1M96bCIOwFJc4S0Zdp-srs2anEJYIZsusJ-QtmCIFEaInZ02OrAyOyWbBC-U-PdX1fR',
    'client_secret': 'EAsgNdbA89zZ6awxzqh4rUHxyht_tEE-w-nWRHKeFTWyDhPJ6ENeCUaA6-3P4seXptgZO31oo4SjE61D'
});

var serviceController = require('../controllers/Service');
var userController = require('../controllers/user');
router.post('/', function (req, res) {
    var serviceId = req.body.id;
    var dateStart = req.body.dateStart;
    var dateEnd = req.body.dateEnd;
    var timeStart = req.body.timeStart;
    var price = parseInt(req.body.price);

    serviceController.getById(serviceId, function (service) {
        var _service = {
            id: service.id,
            title: service.title,
            imagepath: service.imagepath,
            price: price,
            dateStart: dateStart,
            dateEnd: dateEnd,
            timeStart: timeStart,
            ServiceTypeId: service.ServiceTypeId
        }
        req.session.cart.add(_service, _service.id);
        res.sendStatus(204);
        res.end();
    });
});

router.get('/', function (req, res) {
    res.locals.cart = "active";
    res.locals.checkout = "";
    res.locals.payment = "";

    var cart = req.session.cart;
    res.locals.items = cart.generateArray();
    res.locals.totalPrice = cart.totalPrice();
    res.render('cart', { layout: 'cart-layout' });
});

router.put('/', function (req, res) {
    var serviceId = req.body.id;
    var quantity = parseInt(req.body.quantity);
    req.session.cart.update(serviceId, quantity);

    res.sendStatus(204);
    res.end();
});

router.delete('/', function (req, res) {
    var serviceId = req.body.id;
    req.session.cart.remove(serviceId);
    res.sendStatus(204);
    res.end();
});

router.get('/checkout', userController.isLoggedIn, function (req, res) {
    res.locals.cart = "completed";
    res.locals.checkout = "active";
    res.locals.payment = "";

    var cart = req.session.cart;

    res.locals.items = cart.generateArray();
    res.locals.totalPrice = cart.totalPrice();
    res.render('checkout', { layout: 'cart-layout' });
})

router.post('/payment', userController.isLoggedIn, function (req, res) {
    res.locals.cart = 'completed';
    res.locals.checkout = 'completed';
    res.locals.payment = 'active';

    var address = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        district: req.body.district,
        UserId: req.session.user.id
    };

    req.session.cart.address = address;

    var cart = req.session.cart;

    res.locals.items = cart.generateArray();
    res.locals.totalPrice = cart.totalPrice();
    res.render('payment', { layout: 'cart-layout' });
});

var _total = 0;
router.post('/checkout/payment', userController.isLoggedIn, function (req, res) {
    var paymentMethod = req.body.paymentMethod;
    var orderController = require('../controllers/order');

    if (paymentMethod == 'COD') {
        req.session.cart.paymentMethod = paymentMethod;
        orderController.saveOrder(req.session.cart, req.session.user, function () {
            res.locals.paymentStatus = 'Payment Complete!';
            res.locals.paymentMessage = 'Payment Successful !';
            res.render('confirm', { layout: 'layout' });
        });
    }
    else if (paymentMethod == 'Paypal') {
        req.session.cart.paymentMethod = paymentMethod;
        var cart = req.session.cart;
        var items = cart.generateArray();
        var totalPrice = 0;
        var _items = items.map((el) => {
            var item = {
                "name": el.item.title,
                "price": parseFloat(el.item.price / usd).toFixed(2),
                "currency": "USD",
                "quantity": el.quantity
            }
            var price = parseFloat(el.item.price / usd).toFixed(2);
            price = parseFloat(price);
            totalPrice = totalPrice + price*el.quantity;
            return item;
        })
        totalPrice = parseFloat(totalPrice).toFixed(2);
        totalPrice = parseFloat(totalPrice);
        _total = totalPrice;
        console.log(_total);
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://demo-ez-life-web.herokuapp.com/cart/success",
                "cancel_url": "https://demo-ez-life-web.herokuapp.com/cart/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [..._items]
                },
                "amount": {
                    "currency": "USD",
                    "total": totalPrice
                },
                "description": "This is the payment for booking EZ-LIFE"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(JSON.stringify(error));
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    }
    else {
        res.locals.paymentStatus = 'Sorry!';
        res.locals.paymentMessage = 'This payment method has not been supported';
        res.render('custommer-info', { layout: 'customer' });
    }
});
router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": _total
            }
        }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            var orderController = require('../controllers/order');
            console.log(JSON.stringify(payment));
            orderController.saveOrder(req.session.cart, req.session.user, function () {
                res.locals.paymentStatus = 'Payment Complete!';
                res.locals.paymentMessage = 'Payment Successful !';
                res.render('confirm', { layout: 'layout' });
            });
        }
    })
});

router.get('/cancel',(req,res)=>{
    res.locals.paymentStatus = 'Payment Failed!';
    res.locals.paymentMessage = 'Failed in transaction with Paypal !';
    res.render('confirm', { layout: 'layout' });
})
module.exports = router;