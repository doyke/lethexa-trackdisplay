/* global __dirname */

var PORT = 8000;
var HOST = '127.0.0.1';

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var TrackPicture = require('./trackpicture').TrackPicture;
var TrackHistory = require('./positionhistory').TrackHistory;
var MsgQueue = require('./msgqueue').MsgQueue;
var trackservice = require('./trackservice');
var historyservice = require('./historyservice');
var replayservice = require('./replayservice');
var countryservice = require('./countryservice');
var wssvc = require('./wsservice');

module.exports.run = function () {

    var app = express();
// this will make Express serve your static files
    var serverPath = path.join(__dirname, '..', 'public');
    app.use(express.static(serverPath));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var httpServer = http.createServer(app).listen(PORT);
    console.log('Http-server started in port ' + PORT);

    var trackPicture = new TrackPicture();
    var trackHistory = new TrackHistory();
    
    trackservice.registerService(app, trackPicture);
    historyservice.registerService(app, trackHistory, trackPicture);
    countryservice.registerService(app);


    var mq = new MsgQueue('trackdisplay', {
        exchange: 'simulator',
        topics: ['sim.tracks.*']
    });
    mq.initialize();
    mq.on('data', function (routingKey, msg) {
        var jsonMsg = JSON.parse(msg);
        if (jsonMsg.header.type === 'track-update') {
            trackPicture.saveTrack(jsonMsg.data);
            trackHistory.saveTrack(jsonMsg.data);
        }
        webSocket.sendMessageToAll(jsonMsg);
    });


    var createMsg = function (type, data) {
        var msg = {
            header: {
                type: type
            },
            data: data
        };
        return msg;
    };

    var webSocket = new wssvc.WebsocketService(httpServer);
    webSocket.on('connected', function (connection) {
        webSocket.sendMessageTo(connection, createMsg('clear-picture', {}));
        trackPicture.provideTracksOn(function (track) {
            webSocket.sendMessageTo(connection, createMsg('track-update', track));
        });
    });


    replayservice.registerService(app, mq, webSocket);
};
