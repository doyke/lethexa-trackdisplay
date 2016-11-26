/* global __dirname */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var DatabaseAccess = require('./dbaccess').DatabaseAccess;
var TrackPicture = require('./trackpicture').TrackPicture;
var TrackHistory = require('./positionhistory').TrackHistory;
var MsgQueue = require('./msgqueue').MsgQueue;
var trackservice = require('./trackservice');
var historyservice = require('./historyservice');
var replayservice = require('./replayservice');
var countryservice = require('./countryservice');
var imageservice = require('./imageservice');
var wssvc = require('./wsservice');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var assert = require('assert');


var settings = {
    hostname: '127.0.0.1',
    port: 8000
};


module.exports.run = function () {

    var app = express();
// this will make Express serve your static files
    var serverPath = path.join(__dirname, '..', 'public');
    app.use(express.static(serverPath));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var httpServer = http.createServer(app).listen(settings.port);
    console.log('Http-server started in port ' + settings.port);

    var trackPicture = new TrackPicture();
    var trackHistory = new TrackHistory();
    var MongoClient = mongo.MongoClient;

    var url = 'mongodb://localhost:27017/tracklibrary';
    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        console.log("Connected to mongodb.");
        var gfs = Grid(db, mongo);
        
        var dbAccess = new DatabaseAccess(db, gfs);


        var saveTrackInMongoDB = function (track) {
            if (!db)
                return false;
            db.collection('trackhistory').save(track, function (err, result) {
                assert.equal(err, null);
            });

            track._id = track.trackId; // track.header.src + '_' + track.trackId;
            delete track.header;
            db.collection('currenttracks').save(track, function (err, result) {
                assert.equal(err, null);
            });
        };


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
                saveTrackInMongoDB(jsonMsg.data);
            }
            webSocket.sendMessageToAll(jsonMsg);
        });


        trackservice.registerService(app, trackPicture, dbAccess);
        historyservice.registerService(app, trackHistory, trackPicture, db);
        countryservice.registerService(app);
        imageservice.registerService(app, db, gfs);


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
    });
};
