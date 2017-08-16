var TrackPicture = require('./trackpicture').TrackPicture;
var Settings = require('./settings');

module.exports.registerService = function (app, mq, websocket) {
    var trackPicture = new TrackPicture();

    websocket.on('connected', function (connection) {
        websocket.sendMessageTo(connection, Settings.mqOptions.clear_picture, {});
        trackPicture.provideTracksOn(function(track) {
            websocket.sendMessageTo(connection, Settings.mqOptions.entity_msg_update, track);
        });
    });

    mq.on('data', function (routingKey, msg) {
        var jsonMsg = JSON.parse(msg);
        
        if (jsonMsg.header.type === Settings.mqOptions.entity_msg_update) {
            trackPicture.saveTrack(jsonMsg.data);
        }
        if (jsonMsg.header.type === Settings.mqOptions.entity_msg_remove) {
            trackPicture.saveTrack(jsonMsg.data);
        }
        websocket.sendRawMessageToAll(jsonMsg);
    });

    console.log('register Trackservice');
};
