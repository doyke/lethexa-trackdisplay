/* global __dirname */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var DatabaseAccess = require('./dbaccess').DatabaseAccess;
var MsgQueue = require('./msgqueue').MsgQueue;
var trackservice = require('./trackservice');
var replayservice = require('./replayservice');
var imageservice = require('./imageservice');
var ws2mqservice = require('./ws2mqservice');
var wssvc = require('./wsservice');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var assert = require('assert');


var settings = {
    hostname: '127.0.0.1',
    port: 8000,
    databaseUrl: 'mongodb://localhost:27017/tracklibrary'
};


module.exports.run = function () {
    var app = express();
    var serverPath = path.join(__dirname, '..', 'public');
    app.use(express.static(serverPath));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var httpServer = http.createServer(app).listen(settings.port);
    console.log('Http-server started in port ' + settings.port);

    var MongoClient = mongo.MongoClient;

    MongoClient.connect(settings.databaseUrl, function (err, db) {
        assert.equal(err, null);
        console.log("Connected to mongodb.");
        var gfs = Grid(db, mongo);
        
        var dbAccess = new DatabaseAccess(db, gfs);

        var mq = new MsgQueue('trackdisplay', {
            exchange: 'simulator',
            topics: ['sim.tracks.*']
        });
        mq.initialize();

        var websocket = new wssvc.WebsocketService(httpServer);

        trackservice.registerService(app, mq, websocket, dbAccess);
        imageservice.registerService(app, db, gfs);
        replayservice.registerService(app, mq, websocket);
        ws2mqservice.registerService(mq, websocket);
    });
};
