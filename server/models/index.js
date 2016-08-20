var db = require('../db');
var mysql = require('mysql');
var Promise = require('bluebird');
var dbQuery = Promise.promisify(db.connection.query, {context: db.connection});
var dbConnection = Promise.promisify(db.connection.connect, {context: db.connection});
var dbConnectionEnd = Promise.promisify(db.connection.end, {context: db.connection});

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports = {
  messages: {
    get: function (req, res) {
      db.connection.connect(function() {
        db.connection.query('SELECT * FROM messages', function(error, rows, fields) {
          console.log('results are: ', rows);
          // db.connection.end();
          res.writeHead(200);
          res.end(JSON.stringify(rows));
        });
      });
    }, // a function which produces all the messages
    post: function (req, res) {
      // db.connection.connect();
      // console.log('reaching past connect');
      // console.log(req.body);
      // db.connection.query(`INSERT INTO messages (ObjectId, username, roomname, text) VALUES
      // (1, ${req.body.username}, ${req.body.roomname}, ${req.body.text});`, function(err, results) {
      //   if (err) {
      //     console.log('had error: ', err);
      //   } else {
      //     console.log('inside query', results);
      //   }
      //   db.connection.end();
      //   res.writeHead(201, headers);
      //   res.end();
      // });
      // db.connection.connect();  
      // var postUsers = function(req) {
      //   var userId;
      //   var roomId;
      //   db.connection.connect(function(error) {
      //     if(error) {
      //       return error;
      //     }
      //   });
      //   db.connection.query('SELECT userId FROM users WHERE username = ?', 
      //   [req.body.username], function(error, rows, fields) { 
      //     if(error) {
      //       return error;
      //     }
      //     userId = rows[0].userId; 
      //     console.log(1);
      //   });

      //   db.connection.query('INSERT INTO roomname (roomname) VALUES (?)', 
      //   [req.body.roomname], function(error) { if(error) { return error; } })

      //   db.connection.query('SELECT roomId FROM roomname WHERE roomname = ?', 
      //   [req.body.roomname], function(error, newRows, newFields) { 
      //     if (error) {
      //       return error;
      //     }
      //     console.log(3);
      //     roomId = newRows[0].roomId;
      //   });

      //   db.connection.query('INSERT INTO messages (userId, roomId, text) VALUES(?, ?, ?)',
      //   [rows[0].userId, newRows[0].roomId, req.body.message], function(err) {if(error) {return error; } }); 


      //   // db.connection.end();

      // };

      // var postUsersAsync = Promise.promisify(postUsers);
      // postUsersAsync(req);
      // res.writeHead(201, headers);
      // res.end();

      // dbConnection()
      // .then(
      var userId, roomId;
      dbConnection()
      .then(
        dbQuery('SELECT userId FROM users WHERE username = ?', [req.body.username])
        .then(function(rows) {
          userId = rows[0].userId;
          console.log('userids',rows);
          return dbQuery('INSERT INTO roomname (roomname) VALUES (?)', [req.body.roomname]);
        }).then(function() {
          console.log('reached second invocation', userId);
          return dbQuery('SELECT roomId FROM roomname WHERE roomname = ?', [req.body.roomname]);
        }).then(function(newRows) {
          roomId = newRows[0].roomId;
          console.log('reached third invocation', roomId);
          return dbQuery('INSERT INTO messages (userId, roomId, text) VALUES(?, ?, ?)', [userId, roomId, req.body.message])
        })
        .then(
          function() {
            console.log('imhere'); 
            dbConnectionEnd();
            res.writeHead(201);
            res.end();
          })
      );
      // db.connection.connect(function() {      
      //   db.connection.query('SELECT userId FROM users WHERE username = ?', [req.body.username], function(error, rows, fields) {
      //     console.log('rows from username check', rows[0].userId);
      //     db.connection.query('INSERT INTO roomname (roomname) VALUES (?)', [req.body.roomname], function(error) {
      //       console.log('inserted roomname succesfully');
      //       db.connection.query('SELECT roomId FROM roomname WHERE roomname = ?', [req.body.roomname], function(error, newRows, newFields) {
      //         console.log('rows from roomId check', newRows);
      //         db.connection.query('INSERT INTO messages (userId, roomId, text) VALUES(?, ?, ?)',
      //         [rows[0].userId, newRows[0].roomId, req.body.message], function(err) { 
      //           console.log('imhere'); 
      //           db.connection.end();
      //           res.writeHead(201);
      //           res.end();
      //         });
      //       });
      //     });
      //   });
      // });
      console.log('done');
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (req, res) {
      (function(error) {
        db.connection.query('SELECT * FROM users', function(error, rows, fields) {
          console.log('results for users are: ', rows);
          // db.connection.end();
          res.writeHead(200);
          res.end(JSON.stringify(rows));
        });
      });
    },
    post: function (req, res) {
      dbConnection()
      .then(dbQuery('INSERT INTO users (username) VALUES ( ?);', [req.body.username]))
      .catch(function(error) {
        console.log('we messed up', error);
      }).then(function() {
        console.log('completed user post');
        res.writeHead(201);
        res.end('completed');  
      });
        // db.connection.query('INSERT INTO users (username) VALUES ( ?);', [req.body.username], function(error) {
        //   // db.connection.end();
        //   res.writeHead(201);
        //   res.end('completed');
        // });
      // console.log('inside post users');
      // console.log('request', req);
      // console.log('username', req.body.username);
      // db.connection.connect(function(error) {
      //   if (error) {
      //     // console.log('connect error', error);
      //   }
      //   // console.log('connected as id ' + db.connection.threadId);
      // });
      // console.log('reaching past connect');
      // console.log(req.body.username);
    }
  }
};

