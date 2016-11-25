var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports.WebsocketService = function (httpServer) {
    EventEmitter.call(this);
    var connections = [];
    var WebSocketServer = require('websocket').server;
    var wsServer = new WebSocketServer({
        httpServer: httpServer
    });
    var self = this;

    this.sendMessageToAll = function(msg) {
        connections.forEach(function (connection) {
            connection.sendUTF(JSON.stringify(msg));
        });
    };

    this.sendMessageTo = function(connection, msg) {
        connection.sendUTF(JSON.stringify(msg));
    };
    
    var isAllowedOrigin = function() {
        return true;
    };

    wsServer.on('request', function (request) {
        if(!isAllowedOrigin(request.origin)) {
            request.reject();
            console.warn('Connection from', request.origin, 'rejected.');
            return;
        }
        var connection = request.accept('echo-protocol', request.origin);
        connections.push(connection);
        console.log('Connection on websocket accepted...');

        connection.on('message', function (data) {
            var message = JSON.parse(data.utf8Data);
            self.emit(message.header.type, message.data);
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
