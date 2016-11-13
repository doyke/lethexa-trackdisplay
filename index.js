/* global __dirname */

var PORT = 8000;
var HOST = '127.0.0.1';
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var trkpic = require('./lib/trackpicture');
var trkhist = require('./lib/positionhistory');
var geojsonservice = require('./lib/geojsonservice');
var trackservice = require('./lib/trackservice');
var historyservice = require('./lib/historyservice');
var wssvc = require('./lib/wsservice');

var app = express();
// this will make Express serve your static files
var serverPath = path.join(__dirname, 'public');
app.use(express.static(serverPath));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var httpServer = http.createServer(app).listen(PORT);
console.log('Http-server started in port ' + PORT);

var trackPicture = new trkpic.TrackPicture();
var trackHistory = new trkhist.TrackHistory();
geojsonservice.registerService(app, trackPicture);
trackservice.registerService(app, trackPicture);
historyservice.registerService(app, trackHistory);


var createMsg = function(type, data) {
    var msg = {
        header: {
            type: type
        },
        data: data
    };
    return msg;
};

var webSocket = new wssvc.WebsocketService(httpServer);
webSocket.on('connected', function(connection) {
    webSocket.sendMessageTo(connection, createMsg('clear-picture', {}));
    trackPicture.provideTracksOn(function (track) {
        webSocket.sendMessageTo(connection, createMsg('track-update', track));
    });
});


var MsgQueue = require('./lib/msgqueue').MsgQueue;
var mq = new MsgQueue('trackdisplay', { 
  exchange: 'simulator',
  topics: ['sim.tracks.*']
});
mq.initialize();
mq.on('data', function(routingKey, msg) {
  var jsonMsg = JSON.parse(msg);
  if(jsonMsg.header.type === 'track-update') {
    trackPicture.saveTrack(jsonMsg.data);
    trackHistory.saveTrack(jsonMsg.data);
  }
  webSocket.sendMessageToAll(jsonMsg);
});
