# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.7.17)
# Database: transmission
# Generation Time: 2017-04-14 14:01:11 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



-- drop database if it already exists
DROP DATABASE IF EXISTS transmission;

-- create database onlineSound
CREATE DATABASE transmission;


# Dump of table genres
# ------------------------------------------------------------

DROP TABLE IF EXISTS `genres`;

CREATE TABLE `genres` (
  `genreId` int(11) NOT NULL AUTO_INCREMENT,
  `genreType` varchar(20) NOT NULL,
  PRIMARY KEY (`genreId`),
  UNIQUE KEY `genreType` (`genreType`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;

INSERT INTO `genres` (`genreId`, `genreType`)
VALUES
	(5,'blues'),
	(6,'classical'),
	(4,'hip-hop'),
	(3,'jazz'),
	(1,'pop'),
	(2,'rock'),
	(7,'talk');

/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `playlists`;

CREATE TABLE `playlists` (
  `playlistId` int(11) NOT NULL AUTO_INCREMENT,
  `playlistName` varchar(45) NOT NULL,
  `playlistGenre` varchar(20) DEFAULT NULL,
  `playlistUserName` varchar(45) DEFAULT NULL,
  `playlistCreationTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`playlistId`),
  KEY `fk_playlist_user` (`playlistUserName`),
  CONSTRAINT `fk_playlist_user` FOREIGN KEY (`playlistUserName`) REFERENCES `users` (`userDisplayName`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;

INSERT INTO `playlists` (`playlistId`, `playlistName`, `playlistGenre`, `playlistUserName`, `playlistCreationTimestamp`)
VALUES
	(5,'top 100','rock','jill','2017-04-06 07:00:51'),
	(12,'pop tart','pop','jill','2017-04-13 15:52:11'),
	(15,'blah','talk','jill','2017-04-14 12:56:15');

/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tracks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tracks`;

CREATE TABLE `tracks` (
  `trackId` int(11) NOT NULL AUTO_INCREMENT,
  `trackName` varchar(45) DEFAULT NULL,
  `trackArtist` varchar(45) DEFAULT NULL,
  `trackURL` varchar(200) DEFAULT NULL,
  `trackPlaylist` int(11) DEFAULT NULL,
  `tracksCreationTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trackId`),
  KEY `fk_track_playlist` (`trackPlaylist`),
  CONSTRAINT `fk_track_playlist` FOREIGN KEY (`trackPlaylist`) REFERENCES `playlists` (`playlistId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

LOCK TABLES `tracks` WRITE;
/*!40000 ALTER TABLE `tracks` DISABLE KEYS */;

INSERT INTO `tracks` (`trackId`, `trackName`, `trackArtist`, `trackURL`, `trackPlaylist`, `tracksCreationTimestamp`)
VALUES
	(7,'Castle on the Hill','Ed Sheeran','https://soundcloud.com/edsheeran/castle-on-the-hill',5,'2017-04-14 08:42:36'),
	(8,'Shape of You','Ed Sheeran','https://soundcloud.com/edsheeran/shape-of-you',5,'2017-04-14 10:22:37'),
	(9,'Perfect','Ed Sheeran','https://soundcloud.com/edsheeran/perfect',5,'2017-04-14 10:23:38'),
	(10,'test2','test3','https://soundcloud.com/barenaked-ladies/big-bang-theory-theme',12,'2017-04-14 12:48:36'),
	(11,'talk talk talk','xyz','https://soundcloud.com/superduperkylemusic/kyle-ispy-feat-lil-yachty',15,'2017-04-14 12:57:19');

/*!40000 ALTER TABLE `tracks` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userDisplayName` varchar(45) NOT NULL,
  `userEmail` varchar(45) NOT NULL,
  `userFirstName` varchar(45) DEFAULT NULL,
  `userLastName` varchar(45) DEFAULT NULL,
  `userPasswordHash` varchar(45) DEFAULT NULL,
  `userJoinedTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userDisplayName` (`userDisplayName`),
  UNIQUE KEY `userEmail` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`userId`, `userDisplayName`, `userEmail`, `userFirstName`, `userLastName`, `userPasswordHash`, `userJoinedTimestamp`)
VALUES
	(1,'jill','jill@email.com','Jill','Whittick','password','2017-04-06 06:44:24');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
