var express = require('express');
var mysql = require('mysql');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
// router.get('/playlist', function(req, res, next) {

  console.log("get: " + req.session.username);

  var userMsg = req.session.userMsg ? req.session.userMsg : "";
  var username = req.session.username ? req.session.username : "";
  var name = req.session.playlistname ? req.session.playlistname : "";
  var genre = req.session.genre ? req.session.genre : "";
  var playlists = req.session.playlists ? req.session.playlists : "";

  var pool = req.app.get('dbPool');

  req.session.userMsg = "";
  // req.session.username = "";
  req.session.playlistname = "";
  req.session.genre = "";
  req.session.playlists = "";

  pool.getConnection(function(err, connection) {

    if(err) {
      console.log("Error connecting to the database");
      throw err;
    }
    else {
      console.log("Connected to database");
    }

    // Handle bug in the mysql package which causes a 'PROTOCOL_SEQUENCE_TIMEOUT' error
    connection.on('error', function(err) {
      if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
        // ignore bug
        console.log('Ignoring database error - PROTOCOL_SEQUENCE_TIMEOUT');
      }
      else {
        console.log('Received database error: ', err);
      }
    });

    // console.log("select: " + req.session.username);

    connection.query('SELECT * FROM playlist WHERE playlistUsername=?',[username], function(err, results, fields) {
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
        req.session.playlistname = '';
        req.session.genre = '';
        req.session.playlists = '';
        // res.redirect('/playlists');
      }
      else {
        console.log("Playlists found for " + username);
        req.session.userMsg = "";
        req.session.username = username;
        req.session.playlistname = "";
        req.session.genre = "";

        // var allPlaylists = new Array();

        for (var i=0; i<results.length; i++) {
          var playlist = {};
          playlist.id = results[i].playlistId;
          playlist.name = results[i].playlistName;
          playlist.genre = results[i].playlistGenre;

          console.log(JSON.stringify(playlist));

          allPlaylists.push(playlist);

        }
        // req.session.playlists = playlists;
      }

      res.render('playlist', {
        title: 'Create or select a playlist',
        msg: userMsg,
        username: username,
        name: name,
        genre: genre,
        playlists: allPlaylists
      });

    });
  });
});

router.post('/createPlaylist', function(req,res, next) {

  console.log("playlist for: " + username);

  var username = req.session.username;
  var name = req.body.playlist;
  var genre = req.body.genre;

  console.log("playlist for: " + username + " " + name + " " + genre);


  var pool = req.app.get('dbPool');

  pool.getConnection(function(err, connection) {

    if(err) {
      console.log("Error connecting to the database");
      throw err;
    }
    else {
      console.log("Connected to database");
    }

    // Handle bug in the mysql package which causes a 'PROTOCOL_SEQUENCE_TIMEOUT' error
    connection.on('error', function(err) {
      if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
        // ignore bug
        console.log('Ignoring database error - PROTOCOL_SEQUENCE_TIMEOUT');
      }
      else {
        console.log('Received database error: ', err);
      }
    });


    connection.query('SELECT * FROM playlist WHERE playlistName=? AND playlistUsername=?',[name, username], function(err, results, fields) {
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
        req.session.playlistname = "";
        req.session.genre = genre;
        // req.session.playlists = "";
        res.redirect('/playlists');
      }

      else if (results.length === 0) {
        // fail - playlist name not entered
        if (name.trim().length === 0) {
          console.log("Playlist name field empty." + genre);
          req.session.userMsg = "Please enter playlist name.";
          req.session.username = username;
          req.session.playlistname = "";
          req.session.genre = genre;
          // req.session.playlists = "";
          res.redirect('/playlists');
        }
        // fail - genre not entered
        else if (genre.trim().length === 0) {
          console.log("Genre field empty." + name);
          req.session.userMsg = "Please enter genre.";
          req.session.username = username;
          req.session.playlistname = name;
          req.session.genre = "";
          // req.session.playlists = "";
          res.redirect('/playlists');
        }

        else {
          pool.getConnection(function(err, connection) {

            if(err) {
              console.log("Error connecting to the database");
              throw err;
            }
            else {
              console.log("Connected to database");
            }

            // Handle bug in the mysql package which causes a 'PROTOCOL_SEQUENCE_TIMEOUT' error
            connection.on('error', function(err) {
              if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
                // ignore bug
                console.log('Ignoring database error - PROTOCOL_SEQUENCE_TIMEOUT');
              }
              else {
                console.log('Received database error: ', err);
              }
            });
          });

          connection.query('INSERT INTO playlist (playlistName, playlistGenre, playlistUsername) VALUES (?,?,?)',[name, genre, username], function(err, results, fields) {
            connection.release();

            console.log("playlist insert successful. " + name + " " + username);
            // req.session.username = username;
            res.redirect('/playlists');
          });
        }
      }
    });
  });
});

module.exports = router;
