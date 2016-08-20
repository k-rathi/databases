var models = require('../models');
var mysql = require('mysql');
module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(req, res);
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req, res);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(req, res);
    },

    post: function (req, res) {
      models.users.post(req, res);
      // req.on('data', function(chunk) {
      //   buff.push(chunk);
      //   console.log('inside data', chunk);
      // });
      // req.on('end', function() {
      //   console.log(buff.join());
      //   res.writeHead(201);
      //   res.end('completed');
      // });
    } // a function which handles
  }
};

