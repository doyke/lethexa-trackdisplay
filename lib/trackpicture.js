var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports.TrackPicture = function () {
    var trackPicture = {};

    EventEmitter.call(this);

    this.saveTrack = function (track) {
        var trackId = track.trackId;
        trackPicture[trackId] = track;
    };

    this.provideTracksOn = function (callback) {
        for (var key in trackPicture) {
            if (trackPicture.hasOwnProperty(key)) {
                callback(trackPicture[key]);
            }
        }
    };

    this.getTrackById = function (trackId) {
        return trackPicture[trackId];
    };

    this.forEach = function (callback) {
        for(var trackId in trackPicture) {
            if(trackPicture.hasOwnProperty(trackId)) {
                var track = trackPicture[trackId];
                callback(track, trackId);
            }
        }
    };
};

util.inherits(module.exports.TrackPicture, EventEmitter);

