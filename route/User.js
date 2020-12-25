var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var ordersController = require('../controllers/order');
var addressController = require('../controllers/address');
var serviceTypeController = require('../controllers/ServiceType');
var serviceController = require('../controllers/Service');

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/login', function (req, res) {
    req.session.returnURL = req.query.returnURL;
    res.render('login');
})

router.post('/register', function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var phone = req.body.phone;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('phone', 'Phone is required').notEmpty();
    req.checkBody('phone', 'Please enter a valid phone').isMobilePhone();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', ' Confirm Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm Password must match with Password').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', { message: errors });
    } else {
        userController.getUserByUsername(username, function (user) {
            if (user) {
                res.render('register', { message: `Username ${username} exists ! Please choose another username to register` });
            } else {
                var user = {
                    name: name,
                    username: username,
                    phone: phone,
                    email: email,
                    password: password,
                    isAdmin: false
                };
                userController.createUser(user, function (err) {
                    if (err) throw err;
                    res.render('login', { message: 'You have registered, now please Login' })
                })
            }
        })
    }
});

router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var error = req.validationErrors();
    userController.getUserByUsername(username, function (user) {
        if (!user) {
            res.render('login', { error: 'No Username is found' });
        } else {
            userController.comparePassword(password, user.password, function (isMatch) {
                if (!isMatch) {
                    res.render('login', { error: 'Incorrect Password' });
                } else {
                    req.session.user = user;
                    if (req.session.returnURL) {
                        res.redirect(req.session.returnURL);
                    } else {
                        if (user.isAdmin === true) {
                            res.locals.user = user;
                            res.redirect('/users/admin');
                        } else {
                            res.redirect('/');
                        }
                    }
                }
            })
        }
    })
});

router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/users/login');
});

router.get('/profile', userController.isLoggedIn, function (req, res) {
    res.locals.profile = "active";
    res.locals.history = "";
    res.locals.change = "";
    res.render('customer-info', { layout: 'customer' });
})

router.get('/changepassword', userController.isLoggedIn, function (req, res) {
    res.locals.profile = "";
    res.locals.history = "";
    res.locals.change = "active";
    res.render('changePassword', { layout: 'customer' });
})

router.post('/changepassword', userController.isLoggedIn, function (req, res) {
    var current = req.body.old_password;
    var password = req.body.new_password;
    var confirm = req.body.confirm_password;

    req.checkBody('old_password', 'Password is required').notEmpty();
    req.checkBody('new_password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Confirm Password must match with Password').equals(password);

    var error = req.validationErrors();
    userController.comparePassword(current, req.session.user.password, function (isMatch) {
        if (!isMatch) {
            res.render('changePassword', { error: `Mật khẩu cũ không khớp` });
        } else {
            var user = {
                password: password,
                id: req.session.user.id
            };
            userController.updatePassword(user, function (hash_password) {
                req.session.user.password = hash_password;
                res.redirect('/users/profile');
            })
        }
    })
});

router.get('/orderhistory', function (req, res) {
    var user = req.session.user;
    ordersController.getByUser(user, function (orders) {
        res.locals.profile = "";
        res.locals.history = "active";
        res.locals.change = "";
        res.locals.orders = orders;
        res.render('orderHistory', { layout: 'customer' });
    });
});

router.get('/orders/:id', function (req, res) {
    var id = req.params.id;
    ordersController.getById(id, function (order) {
        res.locals.order = order;
        ordersController.getDetailsByOrderId(id, function (details) {
            res.locals.details = details;
            res.render('orderDetail', { layout: 'customer' });
        })
    })
})
var payload_export = {};
router.get('/admin', userController.isAdmin, function (req, res) {
    var orders = [];
    addressController.getAll(function (addresses) {
        addresses.forEach(function (address) {
            ordersController.getById(address.id, function (order) {
                address.status = order.status;
            })
            ordersController.getDetailsByOrderId(address.id, function (details) {
                details.forEach(function (detail) {
                    var order = {};
                    order.address = address;
                    order.detail = detail;
                    orders.push(order);
                })
            })
        })
    });

    var servicelists = [];
    serviceTypeController.getAll(function (serviceTypes) {
        serviceTypes.forEach(function (serviceType) {
            serviceController.getByServiceTypeId(serviceType.id, function (services) {
                var servicelist = {};
                servicelist.serviceType = serviceType;
                servicelist.serviceType.services = services;
                servicelists.push(servicelist);
            });
        });
    });

    setTimeout(function () {
        orders = orders.sort(function (a, b) {
            return b.detail.updatedAt.getTime() - a.detail.updatedAt.getTime();
        });
        res.locals.orders = orders;
        res.locals.servicelists = servicelists;
        payload_export = {
            data: orders,
            fileName: "export.xlsx"
        }
        res.render('admin-orders', { layout: 'admin' });
    }, 500);
});
var payload = {};
router.post('/admin-order', function (req, res) {
    var name = req.body.TenKhachHang;
    var dateStart = req.body.dateStart;
    var timeStart = req.body.timeStart;
    var dateEnd = req.body.dateEnd;
    var phone = req.body.SoDienThoai;
    var email = req.body.email;
    var _address = req.body.address;
    var district = req.body.district;
    var quantity = parseInt(req.body.SoNguoi);
    var paymentMethod = req.body.paymentMethod;
    var status = req.body.status;
    var serviceId = req.body.serviceId;
    var username = req.body.username;

    userController.getUserByUsername(username, function (user) {
        var address = {
            name: name,
            email: email,
            phone: phone,
            address: _address,
            district: district,
            UserId: user.id
        };

        serviceController.getById(serviceId, function (service) {
            var _dateStart = new Date(dateStart);
            var _dateEnd = new Date(dateEnd);
            var distance = parseInt((_dateEnd - _dateStart) / (24 * 3600 * 1000));
            var order = {};
            order.address = address;
            order.paymentMethod = paymentMethod;
            order.status = status;
            order.price = service.price * distance;
            order.totalPrice = order.price * quantity;
            order.quantity = quantity;
            order.dateStart = dateStart;
            order.timeStart = timeStart;
            order.dateEnd = dateEnd;
            order.serviceId = serviceId;
            ordersController.saveOrderByAdmin(order, user, function () {
                res.redirect('/users/admin');
            });
        });
    });
});
var excel = require('../controllers/excel')
router.get('/admin/chart/export', function (req, res) {
    excel.generateExelFile(payload).then(
        (workbook) => {
            workbook.xlsx.writeFile(payload.fileName).then(function () {
                res.download(payload.fileName, payload.fileName)

            });
        },
        (error) => {
            console.log(error)
            res.send(error)
        })

})
router.get('/admin/export', function (req, res) {
    excel.exportFile(payload_export).then(
        (workbook) => {
            workbook.xlsx.writeFile(payload_export.fileName).then(function () {
                res.download(payload_export.fileName, payload_export.fileName)

            });
        },
        (error) => {
            console.log(error)
            res.send(error)
        })

})

router.get('/admin/chart', function (req, res) {
    var today = new Date();
    var day = today.getDate() - 1;
    var month = today.getMonth() - 1;
    var year = today.getFullYear();
    today = new Date(year, month, day);
    console.log("TODAY: ", today);
    var data = {};
    var top_data = {};
    var month_data = {};

    ordersController.getDetailsByDate(today, function (details) {
        var ordersToday = [];
        var services = [];
        var prices = [];
        details.forEach(function (detail) {
            var orderToday = {};
            orderToday.serviceId = detail.ServiceId;
            orderToday.price = parseInt(detail.price);
            if (ordersToday.length > 0) {
                var found = false;
                ordersToday.forEach(function (order) {
                    if (order.serviceId == orderToday.serviceId) {
                        found = true;
                        order.price = parseInt(order.price) + parseInt(order.price);
                    }
                })
                if (found == false) {
                    ordersToday.push(orderToday);
                }
            }
            else {
                ordersToday.push(orderToday);
            }
        });
        ordersToday = ordersToday.sort(function (a, b) {
            return b.price - a.price;
        });
        ordersToday.forEach(function (orderToday) {
            serviceController.getById(orderToday.serviceId, function (service) {
                services.push(service.title);
            })
            prices.push(orderToday.price);
        });

        data = {
            services: services,
            prices: prices
        }

        if (ordersToday.length < 10) {
            top_data = data;
            res.locals.top = ordersToday.length;
        } else {
            var top_services = [];
            var top_prices = [];
            for (var i = 0; i < 10; i++) {
                top_services.push(services[i]);
                top_prices.push(prices[i]);
            }
            top_data = {
                services: top_services,
                prices: top_prices
            }
            res.locals.top = 10;
        }
    });

    res.locals.s_month = parseInt(month + 1);
    var s_month = new Date(year, month, 1);
    console.log("\nSTART MONTH: ", s_month);

    ordersController.getDetailsByDate(s_month, function (details) {
        var ordersMonth = [];
        var m_services = [];
        var m_prices = [];
        details.forEach(function (detail) {
            var orderMonth = {};
            orderMonth.serviceId = detail.ServiceId;
            orderMonth.price = parseInt(detail.price);
            if (ordersMonth.length > 0) {
                var found = false;
                ordersMonth.forEach(function (order) {
                    if (order.serviceId == orderMonth.serviceId) {
                        found = true;
                        order.price = parseInt(order.price) + parseInt(orderMonth.price);
                    }
                })
                if (found == false) {
                    ordersMonth.push(orderMonth);
                }
            }
            else {
                ordersMonth.push(orderMonth);
            }
        });
        ordersMonth = ordersMonth.sort(function (a, b) {
            return b.price - a.price;
        });
        ordersMonth.forEach(function (orderMonth) {
            serviceController.getById(orderMonth.serviceId, function (service) {
                m_services.push(service.title);
            })
            m_prices.push(orderMonth.price);
        });

        month_data = {
            services: m_services,
            prices: m_prices
        }

    });

    setTimeout(function () {
        res.locals.data = JSON.stringify(data);
        res.locals.top_data = JSON.stringify(top_data);
        res.locals.month_data = JSON.stringify(month_data);
        console.log("DATA: ", data);
        payload = {
            reportTitle: "BÁO CÁO DOANH THU THÁNG 04",
            fileName: 'report.xlsx',
            data: [data.services, data.prices]

        }
        console.log('month_data: ', payload)
        res.render('admin-chart', { layout: 'admin' });

    }, 1000);
})

module.exports = router;