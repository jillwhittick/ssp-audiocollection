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

-- create table user
CREATE TABLE user
(
userId INT(11) NOT NULL AUTO_INCREMENT,
userDisplayName VARCHAR(45) NOT NULL UNIQUE,
userEmail VARCHAR(45) NOT NULL UNIQUE,
userFirstName VARCHAR(45),
userSurName VARCHAR(45),
userPasswordHash VARCHAR(45),
userImage VARCHAR(45),
userJoinedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_user PRIMARY KEY(userId)
);


-- create table category
CREATE TABLE category
(
categoryId INT(11) NOT NULL AUTO_INCREMENT,
categoryType VARCHAR(20) NOT NULL UNIQUE,
CONSTRAINT pk_category PRIMARY KEY(categoryId),
CONSTRAINT chk_category CHECK(categoryType
	IN('pop','rock','jazz','hip-hop','blues','classical','talk'))
);


-- create table audiolink
CREATE TABLE audiolink
(
audiolinkId INT NOT NULL AUTO_INCREMENT,
audiolinkName VARCHAR(45),
audiolinkDesc VARCHAR(45),
audiolinkURL VARCHAR(45),
audiolinkImage VARCHAR(45),
audiolinkCreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_audiolink PRIMARY KEY(audiolinkId)
);


-- create table playlist
CREATE TABLE playlist
(
playlistId INT NOT NULL AUTO_INCREMENT,
playlistName VARCHAR(45) NOT NULL,
playlistDesc VARCHAR(45),
playlistImage VARCHAR(45),
playlistUser INT(11),
playlistCreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_playlist PRIMARY KEY(playlistId),
CONSTRAINT fk_playlist_user FOREIGN KEY(playlistUser)
	REFERENCES user(userId)
);


-- create table playlist
CREATE TABLE playlist_audio
(
playlistId INT NOT NULL,
audiolinkId INT NOT NULL,
sequenceNo INT UNSIGNED NOT NULL,
CONSTRAINT pk_playlist_audio PRIMARY KEY(playlistId, audiolinkId),
CONSTRAINT fk_playlist FOREIGN KEY(playlistId)
	REFERENCES playlist(playlistId),
CONSTRAINT fk_audio FOREIGN KEY(audiolinkId)
	REFERENCES audiolink(audiolinkId)
);

-- show existing tables in the onlineSound database
SHOW TABLES;


--  insert tuples into categoryType
INSERT INTO category(categoryType)
VALUES('pop'),
	('rock'),
	('jazz'),
	('hip-hop'),
	('blues'),
	('classical'),
	('talk');

-- view all entries in genre relation
SELECT * FROM category;


SELECT '<Finish onlineSound script>' AS '';
