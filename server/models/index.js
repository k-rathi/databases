var db = require('../db');
var mysql = require('mysql');
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
          db.connection.end();
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
      db.connection.connect(function() {      
        db.connection.query('SELECT userId FROM users WHERE username = ?', [req.body.username], function(error, rows, fields) {
          console.log('rows from username check', rows[0].userId);
          db.connection.query('INSERT INTO roomname (roomname) VALUES (?)', [req.body.roomname], function(error) {
            console.log('inserted roomname succesfully');
            db.connection.query('SELECT roomId FROM roomname WHERE roomname = ?', [req.body.roomname], function(error, newRows, newFields) {
              console.log('rows from roomId check', newRows);
              db.connection.query('INSERT INTO messages (userId, roomId, text) VALUES(?, ?, ?)',
              [rows[0].userId, newRows[0].roomId, req.body.message], function(err) { 
                console.log('imhere'); 
                db.connection.end();
                res.writeHead(201);
                res.end();
              });
            });
          });
        });
      });
      // console.log('done');

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (req, res) {
      db.connection.connect(function(error) {
        db.connection.query('SELECT * FROM users', function(error, rows, fields) {
          console.log('results for users are: ', rows);
          db.connection.end();
          res.writeHead(200);
          res.end(JSON.stringify(rows));
        });
      });
    },
    post: function (req, res) {
      db.connection.connect(function(error) {
        db.connection.query('INSERT INTO users (username) VALUES ( ?);', [req.body.username], function(error) {
          db.connection.end();
          res.writeHead(201);
          res.end('completed');
        });
      });
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

