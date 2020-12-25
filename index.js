var express = require('express');
var path = require('path');
var app = express();

//Setting for app here
const morgan = require('morgan');
app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400;
    },
    stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400;
    },
    stream: process.stdout
}));

var multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('myImage');

function checkFileType(file, callback) {
    const filetype = /jpeg|jpg|png|gif/;
    const extname = filetype.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetype.test(file.mimetype);
    if (extname && mimetype) {
        return callback(null, true);
    }
    else {
        callback('Error: Images Only!!!');
    }
}

app.set('port', process.env.PORT || 5000);

//Set Public Folder
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use View Engine
function formatDate(date) {
    return date.toLocaleString('en-US');
}
var expressHbs = require('express-handlebars');
var paginateHelper = require('express-handlebars-paginate');
var hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        paginate: paginateHelper.createPagination,
        formatDate: formatDate
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Use Cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use Session 
var sessions = require('express-session');
app.use(sessions({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },//30 days
    secret: "S4cret",
    resave: false,
    saveUninitialized: false
}));

//Use ExpressValidator
var expressValidator = require('express-validator');
app.use(expressValidator());

//Use Cart
var Cart = require('./controllers/cart');
app.use(function (req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.cartItemCount = cart.totalQuantity();

    res.locals.user = req.session.user;
    res.locals.isLoggedIn = req.session.user ? true : false;
    if(req.session.user){
        res.locals.isAdmin = req.session.user.isAdmin;
    }
    next();
})


//Define Route
//Homepage

var indexRouter = require('./route/ServiceType');
var servicetypeController = require('./controllers/ServiceType');
var serviceController = require('./controllers/Service');
var userController = require('./controllers/user');
app.use('/', indexRouter);
app.post('/servicetype', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            if (req.file == undefined) {
                console.log("No file is selected!");
            } else {
                var serviceType = {
                    imagepath: `/uploads/${req.file.filename}`,
                    title: req.body.title,
                    des1: req.body.des1,
                    des2: req.body.des2,
                    des3: req.body.des3
                };
                servicetypeController.add(serviceType, function () {
                    res.redirect('/');
                })
            }
        }
    })
});
app.post('/service', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            if (req.file == undefined) {
                console.log("No file is selected!");
            }
            else {
                var service = {
                    imagepath: `/uploads/${req.file.filename}`,
                    title: req.body.title,
                    price: req.body.price,
                    ServiceTypeId: req.body.ServiceTypeId
                };
                serviceController.add(service, function () {
                    res.redirect(`/servicetype/${req.body.ServiceTypeId}`);
                })
            }
        }
    })
})
app.post('/profile', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            if (req.file == undefined) {
                console.log("No file is selected!");
            }
            else {
                var imagepath = `/uploads/${req.file.filename}`;
                req.session.user.imagepath = imagepath;
                var user = {
                    id: req.session.user.id,
                    imagepath: imagepath
                };
                userController.updateAvatar(user, function () {
                    res.redirect('/users/profile');
                })
            }
        }
    });
});



var serviceRouter = require('./route/Service');
app.use('/service', serviceRouter);

var userRouter = require('./route/User');
app.use('/users', userRouter);

//cart
var cartRouter = require('./route/cart');
app.use('/cart', cartRouter);

//Introduction
app.get('/introduction', function (req, res) {
    res.render('introduction');
});

//Support
app.get('/support', function (req, res) {
    res.render('support');
});

//Contact
app.get('/contact', function (req, res) {
    res.render('contact');
});


//create Database
var models = require('./models');
app.get('/sync', function (req, res) {
    models.sequelize.sync()
        .then(function () {
            res.send("Database has been created!");
        });
});

app.listen(app.get('port'), function () {
    console.log("Server is listening on Port: ", app.get('port'));
});