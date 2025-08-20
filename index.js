// var express = require('express');
// var bodyParser = require('body-parser');
// var session = require('express-session');
// var upload = require('express-fileupload');
// var path = require('path'); // 🔹 path module लागेल

// var admin = require('./routes/admin');
// var login = require('./routes/login'); 
// var app = express();

// // 🔹 View engine सेट करा
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(upload());

// app.use(session({
//     secret: 'omakrbhawar',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use('/', admin);
// app.use('/login', login);



// app.listen(3000, () => {
//     console.log("✅ Server running on http://localhost:3000");
// });



var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var upload = require('express-fileupload');
var path = require('path');
require("dotenv").config();

var admin = require('./routes/admin'); // Your admin routes
var login = require('./routes/login'); // Login routes

var app = express();

// 🔹 View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🔹 Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(upload());

app.use(session({
    secret: 'omakrbhawar',
    resave: false,
    saveUninitialized: true
}));

// 🔹 Middleware to protect admin routes
function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// 🔹 Routes
app.use('/login', login);               // Login page
app.use('/', requireLogin, admin);      // Admin routes protected

// 🔹 Optional: Root redirect
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard'); // redirect to a main admin page
    } else {
        res.redirect('/login');
    }
});

app.listen(process.env.PORT || 3000);
