var express = require('express');
var mysql = require('mysql');
var connect = require('../database/connect');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var userMsg = req.session.userMsg ? req.session.userMsg : "";
    var username = req.session.username ? req.session.username : "";
    var id = req.session.playlistid ? req.session.playlistid : "";
    var name = req.session.playlistname ? req.session.playlistname : "";
    var genre = req.session.genre ? req.session.genre : "";
    var playlists = req.session.playlists ? req.session.playlists : "";

    req.session.userMsg = "";
    // req.session.username = "";
    req.session.playlistid = "";
    req.session.playlistname = "";
    req.session.genre = "";
    req.session.playlists = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            connection.query('SELECT * FROM playlists WHERE playlistUserName=?',[username], function(err, results, fields) {
                connection.release();

                console.log('Query returned ' + JSON.stringify(results));

                var allPlaylists = new Array();

                if(err) {
                    throw err;
                }
                    // no playlists
                    else if (results.length === 0) {
                    console.log("No playlists found for " + username);
                    req.session.userMsg = "";
                    req.session.username = username;
                    req.session.playlistid = '';
                    req.session.playlistname = '';
                    req.session.genre = '';
                    req.session.playlists = '';
                    // res.redirect('/playlists');
                }
                else {
                    console.log("Playlists found for " + username);
                    req.session.userMsg = "";
                    req.session.username = username;
                    req.session.playlistid = '';
                    req.session.playlistname = "";
                    req.session.genre = "";

                    for (var i=0; i<results.length; i++) {
                        var playlist = {};
                        playlist.id = results[i].playlistId;
                        playlist.name = results[i].playlistName;
                        playlist.genre = results[i].playlistGenre;

                        console.log(JSON.stringify(playlist));

                        allPlaylists.push(playlist);
                    }
                }

                res.render('playlists', {
                    msg: userMsg,
                    username: username,
                    access: req.session.username,
                    id: id,
                    name: name,
                    genre: genre,
                    playlists: allPlaylists
                });

            });
        }
    });
});

router.post('/createPlaylist', function(req,res, next) {

    var username = req.session.username;
    var name = req.body.playlist;
    var genre = req.body.genre;

    console.log("playlist for: " + username + " " + name + " " + genre);

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            connection.query('SELECT * FROM playlists WHERE playlistName=? AND playlistUserName=?',[name, username], function(err, results, fields) {
                connection.release();

                console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // fail - playlist exists for user
                else if (results.length !== 0) {
                    console.log("Playlist name already exists." + name + genre);
                    req.session.userMsg = "Playlist name alreday in use. Please choose different playlist name.";
                    req.session.username = username;
                    req.session.playlistid = '';
                    req.session.playlistname = "";
                    req.session.genre = genre;
                    // req.session.playlists = "";
                    res.redirect('/playlists');
                }
                else if (results.length === 0) {
                    // fail - playlist name not entered
                    if (name.length === 0) {
                        console.log("Playlist name field empty." + genre);
                        req.session.userMsg = "Please enter playlist name.";
                        req.session.username = username;
                        req.session.playlistid = '';
                        req.session.playlistname = "";
                        req.session.genre = genre;
                        // req.session.playlists = "";
                        res.redirect('/playlists');
                    }
                    // fail - genre not entered
                    else if (genre.length === 0) {
                        console.log("Genre field empty." + name);
                        req.session.userMsg = "Please enter genre.";
                        req.session.username = username;
                        req.session.playlistid = "";
                        req.session.playlistname = name;
                        req.session.genre = "";
                        // req.session.playlists = "";
                        res.redirect('/playlists');
                    }
                    else {
                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                connection.query('INSERT INTO playlists (playlistName, playlistGenre, playlistUserName) VALUES (?,?,?)',[name, genre, username], function(err, results, fields) {
                                    connection.release();

                                    console.log('Insert returned ' + JSON.stringify(results));

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


router.get('/delete/:id', function(req,res, next) {

    var username = req.session.username;
    var playlistid = req.params.id;


    connect(function(err, connection) {
        if (req.params.id) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                connection.query('SELECT * FROM tracks WHERE trackPlaylist=?',[req.params.id], function(err, results, fields) {
                    // connection.release();

                    if(err) {
                        throw err;
                    }
                    // fail - tracks exists playlist
                    else if (results.length !== 0) {
                        console.log("Tracks exist for playlist");
                        req.session.userMsg = "Unable to delete playlist. Playlist contains tracks.";
                        req.session.username = username;
                        req.session.playlistid = '';
                        req.session.playlistname = "";
                        // req.session.genre = genre;
                        res.redirect('/playlists');
                    }
                    else{
                        connect(function(err, connection) {
                            if (req.params.id) {
                                if (err) {
                                    console.log("Error connecting to the database");
                                    throw err;
                                }
                                else {
                                    connection.query('DELETE FROM playlists WHERE playlistId=?',[req.params.id], function(err, results, fields) {
                                        connection.release();

                                        console.log('delete complete');

                                        req.session.userMsg = "Playlist deleted.";
                                        req.session.username = username;
                                        req.session.playlistid = '';
                                        req.session.playlistname = "";
                                        // req.session.genre = genre;
                                        res.redirect('/playlists');
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});


module.exports = router;
