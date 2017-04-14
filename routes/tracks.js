var express = require('express');
var mysql = require('mysql');
var connect = require('../database/connect');

var router = express.Router();

var playlistid = "";
var playlistname = "";

/* GET home page. */
router.get('/:id/:name', function(req, res, next) {

    var userMsg = req.session.userMsg ? req.session.userMsg : "";
    var username = req.session.username ? req.session.username : "";
    var trackid = req.session.trackid ? req.session.trackid : "";
    var name = req.session.trackname ? req.session.trackname : "";
    var artist = req.session.artist ? req.session.artist : "";
    var url = req.session.url ? req.session.url : "";
    var tracks = req.session.playlists ? req.session.tracks : "";

    playlistid = req.session.playlistid = req.params.id;
    playlistname = req.session.playlistname = req.params.name;
    console.log ("id " + playlistid + "  name " + playlistname);

    req.session.userMsg = "";
    // req.session.username = "";
    req.session.trackid = "";
    req.session.trackname = "";
    req.session.artist = "";
    req.session.url = "";
    req.session.tracks = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {

            if (req.params.id) {

                connection.query('SELECT * FROM tracks WHERE trackPlaylist=?',[req.params.id], function(err, results, fields) {
                    connection.release();

                    console.log('Query returned ' + JSON.stringify(results));

                    var allTracks = new Array();

                    if(err) {
                        throw err;
                    }
                        // no playlists
                        else if (results.length === 0) {
                        console.log("No playlists found");
                        req.session.userMsg = "";
                        req.session.username = username;
                        req.session.playlistid = playlistid;
                        req.session.playlistname = playlistname;
                        req.session.trackid = '';
                        req.session.trackname = '';
                        req.session.url = '';
                        req.session.tracks = '';
                    }
                    else {
                        console.log("Tracks found for " + playlistname);
                        req.session.userMsg = "";
                        req.session.username = username;
                        req.session.playlistid = playlistid;
                        req.session.playlistname = playlistname;
                        req.session.trackid = '';
                        req.session.trackname = "";
                        req.session.artist = "";
                        req.session.url = "";

                        for (var i=0; i<results.length; i++) {
                            var track = {};
                            track.trackid = results[i].trackId;
                            track.name = results[i].trackName;
                            track.artist = results[i].trackArtist;
                            track.url = results[i].trackURL;

                            console.log(JSON.stringify(track));

                            allTracks.push(track);
                        }
                    }

                    res.render('tracks', {
                        msg: userMsg,
                        username: username,
                        access: req.session.username,
                        playlistid: playlistid,
                        playlistname: playlistname,
                        trackid: trackid,
                        name: name,
                        artist: artist,
                        url: url,
                        tracks: allTracks
                    });

                });
            }
        }
    });
});

router.post('/createTrack', function(req,res, next) {

    var username = req.session.username;
    // var playlistid = req.params.id;
    // var playlistname = req.params.name;
    var name = req.body.track;
    var artist = req.body.artist;
    var url = req.body.url;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            connection.query('SELECT * FROM tracks WHERE trackURL=? AND trackPlaylist=?',[url, playlistid], function(err, results, fields) {
                connection.release();

                console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // fail - url exists for playlist
                else if (results.length !== 0) {
                    console.log("Track url already exists." + name + url);
                    req.session.userMsg = "Track URL already exists in playlist. Please choose different track.";
                    req.session.username = username;
                    req.session.playlistid = playlistid;
                    req.session.playlistname = playlistname;
                    req.session.trackname = name;
                    req.session.artist = artist;
                    req.session.url = "";
                    res.redirect('/tracks/' + playlistid + '/' + playlistname);
                }
                else if (results.length === 0) {
                    // fail - track name not entered
                    if (name.length === 0) {
                        console.log("Track name field empty.");
                        req.session.userMsg = "Please enter track name.";
                        req.session.username = username;
                        req.session.playlistid = playlistid;
                        req.session.playlistname = playlistname;
                        req.session.trackname = name;
                        req.session.artist = artist;
                        req.session.url = url;
                        res.redirect('/tracks/' + playlistid + '/' + playlistname);
                        // res.redirect('/tracks/:id/:name');
                    }
                    // fail - artist not entered
                    else if (artist.length === 0) {
                        console.log("Artist field empty.");
                        req.session.userMsg = "Please enter artist.";
                        req.session.username = username;
                        req.session.playlistid = playlistid;
                        req.session.playlistname = playlistname;
                        req.session.trackname = name;
                        req.session.artist = artist;
                        req.session.url = url;
                        res.redirect('/tracks/' + playlistid + '/' + playlistname);
                    }
                    // fail - artist not entered
                    else if (url.length === 0) {
                        console.log("URL field empty.");
                        req.session.userMsg = "Please enter URL.";
                        req.session.username = username;
                        req.session.playlistid = playlistid;
                        req.session.playlistname = playlistname;
                        req.session.trackname = name;
                        req.session.artist = artist;
                        req.session.url = url;
                        res.redirect('/tracks/' + playlistid + '/' + playlistname);
                    }
                    else {
                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {

                                console.log("name: " + name);
                                console.log("artist: " + artist);
                                console.log("url: " + url);
                                console.log("playlist: " + playlistid);


                                connection.query('INSERT INTO tracks (trackName, trackArtist, trackURL, trackPlaylist) VALUES (?,?,?,?)',[name, artist, url, playlistid], function(err, results, fields) {
                                    connection.release();

                                    console.log('Insert returned ' + JSON.stringify(results));

                                    res.redirect('/tracks/' + playlistid + '/' + playlistname);
                                    // res.redirect('/tracks/:id/:name');
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
