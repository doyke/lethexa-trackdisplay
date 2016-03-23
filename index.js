var PORT = 8000;
var HOST = '127.0.0.1';
var express = require('express');
var http = require('http');
var app = express();

// this will make Express serve your static files
var serverPath = __dirname + '/public/';
app.use(express.static(serverPath));

var httpServer = http.createServer(app).listen(PORT);
console.log('Http-server started in port ' + PORT);




var WebSocketServer = require('websocket').server;
var MsgQueue = require('./lib/msgqueue').MsgQueue;

var connections = [];
var mq = new MsgQueue('simulator', { 
  exchange: 'wis.sim',
  topics: ['wis.ptf.test.navdata', 'wis.ptf.test.systemtrack']
});
mq.initialize();
mq.on('data', function(routingKey, msg) {
  var jsonMsg = JSON.parse(msg);
//  console.log(routingKey, msg);

  connections.forEach( function(connection) {
    connection.sendUTF(msg);
  });
})


var wsServer = new WebSocketServer({
  httpServer: httpServer
});

wsServer.on('request', function (request) {
    var connection = request.accept('tracks', request.origin);
    connections.push(connection);
    console.log('Connection on websocket accepted...');

    connection.on('message', function (message) {
//      console.log('message', message.utf8Data);
    });

    connection.on('close', function(reasonCode, description) {
      console.log('Connection on websocket closed...')
      connections.splice(connections.indexOf(connection), 1);
    });
});

