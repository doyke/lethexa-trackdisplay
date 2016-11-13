var EventEmitter = require('events');
var util = require('util');

module.exports.WebsocketService = function (httpServer) {
    EventEmitter.call(this);
    var connections = [];
    var WebSocketServer = require('websocket').server;
    var wsServer = new WebSocketServer({
        httpServer: httpServer
    });
    var self = this;

    this.sendToAll = function(msg) {
        connections.forEach(function (connection) {
            connection.sendUTF(msg);
        });
    };

    wsServer.on('request', function (request) {
        var connection = request.accept('tracks', request.origin);
        connections.push(connection);
        console.log('Connection on websocket accepted...');

        connection.on('message', function (data) {
            var message = JSON.parse(data.utf8Data);
            self.emit(message.type, message);
        });

        connection.on('close', function (reasonCode, description) {
            console.log('Connection on websocket closed...');
            connections.splice(connections.indexOf(connection), 1);
            self.emit('disconnected');
        });

        self.emit('connected', connection);
    });
};
util.inherits(module.exports.WebsocketService, EventEmitter);
