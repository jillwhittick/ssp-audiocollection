var express = require('express');
var mysql = require('mysql');
var connect = require('../database/connect');

var router = express.Router();


/* GET home page */
router.get('/', function(req, res, next) {

    if (!req.session.username) {

        var userMsg = req.session.userMsg ? req.session.userMsg : "";
        var username = req.session.username ? req.session.username : "";

        req.session.userMsg = "";
        req.session.username = "";

        res.render('index', { msg: userMsg, username: username });
    }
    else {
        res.redirect('/playlists');
    }

});


router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});


router.post('/login', function(req, res, next) {


    console.log("login");

    var username = req.body.username;
    var password = req.body.password;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            connection.query('SELECT * FROM users WHERE userDisplayName=?',[username], function(err, results, fields) {
                connection.release();

                console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // successful login - id and password match
                else if ((results.length !== 0) && (password === results[0].userPasswordHash)) {
                    console.log("Login successful!");
                    req.session.username = username;
                    req.session.userID = results.userId;

                    res.redirect('/playlists');
                }
                // fail login - id not found
                else if ((results.length === 0) && (username.trim().length !== 0)) {
                    console.log("Username not found.");
                    req.session.userMsg = "Username is not registered.";
                    res.redirect('/');
                }
                // fail login - id not entered
                else if (username.trim().length === 0) {
                    console.log("No username entered.");
                    req.session.userMsg = "Please enter username.";
                    res.redirect('/');
                }
                // fail login - password not entered
                else if (password.trim().length === 0) {
                    console.log("No password entered.");
                    req.session.userMsg = "Please enter password.";
                    req.session.username = username;
                    res.redirect('/');
                }
                // fail login - password does not match
                else if ((results.length !== 0) && (password !== results[0].userPasswordHash)) {
                    console.log("Incorrect password.");
                    req.session.userMsg = "Password incorrect.";
                    req.session.username = username;
                    res.redirect('/');
                }
                // fail login - user does not exist
                else  {
                    console.log("User not registered.");
                    req.session.userMsg = username + " does not exist. Please register.";
                    res.redirect('/');
                }
            });
        }
    });
});

module.exports = router;
