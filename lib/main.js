/* global __dirname */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var MsgQueue = require('./msgqueue').MsgQueue;
var trackservice = require('./trackservice');
var replayservice = require('./replayservice');
var ws2mqservice = require('./ws2mqservice');
var wssvc = require('./wsservice');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var assert = require('assert');
var Settings = require('./settings');


module.exports.run = function () {
    var app = express();
    var serverPath = path.join(__dirname, '..', 'public');
    app.use(express.static(serverPath));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var httpServer = http.createServer(app).listen(Settings.trackserver.port);
    console.log('Http-server started in port ' + Settings.trackserver.port);

    var mq = new MsgQueue('trackdisplay', {
        exchange: Settings.mqOptions.exchange,
        topics: [Settings.mqOptions.topic_gt_object + '.*']
    });
    mq.initialize();

    var websocket = new wssvc.WebsocketService(httpServer);

    trackservice.registerService(app, mq, websocket);
    replayservice.registerService(app, mq, websocket);
    ws2mqservice.registerService(mq, websocket);
};
