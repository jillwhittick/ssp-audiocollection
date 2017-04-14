var express = require('express');
var mysql = require('mysql');
var connect = require('../database/connect');

var router = express.Router();

// GET home register page
router.get('/', function(req, res, next) {

    var userMsg = req.session.userMsg ? req.session.userMsg : "";
    var username = req.session.username ? req.session.username : "";
    var email = req.session.email ? req.session.email : "";
    var firstname = req.session.firstname ? req.session.firstname : "";
    var lastname = req.session.lastname ? req.session.lastname : "";

    req.session.userMsg = "";
    req.session.username = "";
    req.session.email = "";
    req.session.firstname = "";
    req.session.lastname = "";

    res.render('register', {
        msg: userMsg,
        username: username,
        email: email,
        firstname: firstname,
        lastname: lastname,
    });
});

// POST create/register user
router.post('/createUser', function(req,res, next) {

    var username = req.body.username;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var confirm = req.body.confirm;

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
                // fail - username exists
                else if (results.length !== 0) {
                    console.log("Username already exists.");
                    req.session.userMsg = "Username alreday in use. Please choose different username.";
                    req.session.email = email;
                    req.session.firstname = firstname;
                    req.session.lastname = lastname;
                    // req.session.password = password;
                    // req.session.confirm = confirm;
                    console.log(username);
                    res.redirect('/register');
                }

                else if (results.length === 0) {
                    // fail - username not entered
                    if (username.trim().length === 0) {
                        console.log("Username field empty.");
                        req.session.userMsg = "Please enter username.";
                        req.session.email = email;
                        req.session.firstname = firstname;
                        req.session.lastname = lastname;
                        // req.session.password = password;
                        // req.session.confirm = confirm;
                        res.redirect('/register');
                    }
                    // fail - email not entered
                    else if (email.trim().length === 0) {
                        console.log("Email field empty.");
                        req.session.userMsg = "Please enter email.";
                        req.session.username = username;
                        req.session.firstname = firstname;
                        req.session.lastname = lastname;
                        // req.session.password = password;
                        // req.session.confirm = confirm;
                        res.redirect('/register');
                    }
                    // fail - firstname not entered
                    else if (firstname.trim().length === 0) {
                        console.log("Firstname field empty.");
                        req.session.userMsg = "Please enter first name.";
                        req.session.username = username;
                        req.session.email = email;
                        req.session.lastname = lastname;
                        // req.session.password = password;
                        // req.session.confirm = confirm;
                        res.redirect('/register');
                    }
                    // fail - lastname not entered
                    else if (lastname.trim().length === 0) {
                        console.log("Lastname field empty.");
                        req.session.userMsg = "Please enter last name.";
                        req.session.username = username;
                        req.session.email = email;
                        req.session.firstname = firstname;
                        // req.session.password = password;
                        // req.session.confirm = confirm;
                        res.redirect('/register');
                    }
                    // fail - password not entered
                    else if (password.trim().length === 0) {
                        console.log("Password field empty.");
                        req.session.userMsg = "Please enter password.";
                        req.session.username = username;
                        req.session.email = email;
                        req.session.firstname = firstname;
                        req.session.lastname = lastname;
                        // req.session.confirm = confirm;
                        res.redirect('/register');
                    }
                    // fail - confirm password not entered
                    else if (confirm.trim().length === 0) {
                        console.log("Confirm field empty.");
                        req.session.userMsg = "Please enter confirm password.";
                        req.session.username = username;
                        req.session.email = email;
                        req.session.firstname = firstname;
                        req.session.lastname = lastname;
                        // req.session.password = password;
                        res.redirect('/register');
                    }
                    // fail - password and confirm password do not match
                    else if (password.trim() !== confirm.trim()) {
                        console.log("Confirm field empty.");
                        req.session.userMsg = "Password fields do not match. Please re-enter.";
                        req.session.username = username;
                        req.session.email = email;
                        req.session.firstname = firstname;
                        req.session.lastname = lastname;
                        // req.session.password = '';
                        // req.session.confirm = '';
                        res.redirect('/register');
                    }
                    else {
                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                connection.query('INSERT INTO users (userDisplayName, userEmail, userFirstName, userLastName, userPasswordHash) VALUES (?,?,?,?,?)',[username, email, firstname, lastname, password], function(err, results, fields) {
                                    connection.release();

                                    console.log("Register and login successful. " + username);
                                    console.log("This is a test.");
                                    req.session.username = username;
                                    // req.session.userID = results.userId;
                                    res.redirect('/playlists');
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;
