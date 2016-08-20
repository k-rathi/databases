
-- CREATE DATABASE chat;

USE chat;
drop table if exists messages;
drop table if exists users;
drop table if exists roomname;

CREATE TABLE roomname (
  roomId int(255) PRIMARY KEY AUTO_INCREMENT,
  roomname varchar(45) NOT NULL
);


CREATE TABLE users (
  userId int(255) PRIMARY KEY AUTO_INCREMENT,
  username varchar(45) NOT NULL
);




CREATE TABLE messages ( 
 ObjectId int(255) PRIMARY KEY AUTO_INCREMENT,
 userId int(255) NOT NULL, 
 text varchar(45) NOT NULL,
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 roomId int(255) NOT NULL,
 FOREIGN KEY (userId) REFERENCES users(userId),
 FOREIGN KEY (roomId) REFERENCES roomname(roomId)
   /* Describe your table here.*/
);
-- INSERT INTO roomname (roomId, roomname) VALUES
-- (1, 'lobby');

-- INSERT INTO users (userId, username) VALUES
-- (1, 'Harry Potter');


-- INSERT INTO messages (ObjectId, username, roomname, text) VALUES
-- (1, 'Harry Potter', 'lobby', 'hello'),
-- (2, 'Dumbledore', 'lobby', 'goodbye');


-- CREATE TABLE users_friends (

-- );

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

