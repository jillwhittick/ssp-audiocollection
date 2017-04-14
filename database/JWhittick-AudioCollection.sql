/*
  Name:			Jill Whittick
  Student Id:	K00214325
  File:			JWhittick-AudioCollection.sql
  Description:	SSP-AudioCollection-2017 Assignment
  Created:		March 14, 2017
  Version:		1.0
*/

SELECT '<Start audioCollection script>' AS '';

-- Part 1:

-- drop database if it already exists
DROP DATABASE IF EXISTS audioCollection;

-- show warnings
SHOW WARNINGS;

-- create database onlineSound
CREATE DATABASE audioCollection;

-- show existing databases
SHOW DATABASES;

-- select the onlineSound database
USE audioCollection;

-- create table users
CREATE TABLE users
(
userId INT(11) NOT NULL AUTO_INCREMENT,
userDisplayName VARCHAR(45) NOT NULL UNIQUE,
userEmail VARCHAR(45) NOT NULL UNIQUE,
userFirstName VARCHAR(45),
userLastName VARCHAR(45),
userPasswordHash VARCHAR(45),
userJoinedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_user PRIMARY KEY(userId)
);


-- create table genres
CREATE TABLE genres
(
genreId INT NOT NULL AUTO_INCREMENT,
genreType VARCHAR(20) NOT NULL UNIQUE,
CONSTRAINT pk_genre PRIMARY KEY(genreId),
CONSTRAINT chk_genre CHECK(genreType
	IN('pop','rock','jazz','hip-hop','blues','classical','talk'))
);


-- create table playlists
CREATE TABLE playlists
(
playlistId INT NOT NULL AUTO_INCREMENT,
playlistName VARCHAR(45) NOT NULL,
playlistGenre INT,
playlistUserName VARCHAR(45),
playlistCreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_playlist PRIMARY KEY(playlistId),
CONSTRAINT fk_playlist_genre FOREIGN KEY(playlistGenre)
	REFERENCES genres(genreId),
CONSTRAINT fk_playlist_user FOREIGN KEY(playlistUserName)
	REFERENCES users(userDisplayName)
);


-- create table tracks
CREATE TABLE tracks
(
trackId INT NOT NULL AUTO_INCREMENT,
trackName VARCHAR(45),
trackURL VARCHAR(45),
trackPlaylist INT,
tracksCreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_tracks PRIMARY KEY(trackId),
CONSTRAINT fk_track_playlist FOREIGN KEY(trackPlaylist)
	REFERENCES playlists(playlistId)
);



-- show existing tables in the onlineSound database
SHOW TABLES;


--  insert tuples into genreType
INSERT INTO genres(genreType)
VALUES('pop'),
	('rock'),
	('jazz'),
	('hip-hop'),
	('blues'),
	('classical'),
	('talk');

-- view all entries in genre relation
SELECT * FROM genres;


SELECT '<Finish onlineSound script>' AS '';
