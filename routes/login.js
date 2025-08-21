// var express = require('express');
// var router = express.Router();

// // GET login page
// router.get('/', (req, res) => {
//     res.render('login', { error: null });
// });

// // POST login form
// router.post('/', (req, res) => {
//     const { username, password } = req.body;

//     if (username === 'admin' && password === '1234') {
//         req.session.user = username;
//         res.redirect('/');
//     } else {
//         res.render('login', { error: 'Invalid username or password' });
//     }
// });


// // LOGOUT route
// router.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.log(err);
//         }
//         res.redirect('/login');
//     });
// });


// module.exports = router;



var express = require('express');
var router = express.Router();

// GET login page
router.get('/', (req, res) => {
    res.render('login', { error: null });
});

// POST login form
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // 🔹 Replace with your real authentication logic
    if (username === 'omkarab111@gmail.com' && password === '6111') {
        req.session.user = username;      // Save user session
        res.redirect('/');                 // Redirect to admin page
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect('/login');
    });
});

module.exports = router;
