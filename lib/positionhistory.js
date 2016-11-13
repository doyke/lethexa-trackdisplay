var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports.TrackHistory = function () {
    EventEmitter.call(this);
    var trackHistory = {};
    var MAX_HISTORY_SIZE = 1000;

    this.saveTrack = function (track) {
        var trackId = track.trackId;
        var history = trackHistory[trackId];
        if (history === undefined) {
            history = [];
            trackHistory[trackId] = history;
        }
        history.push({
            time: track.lastctc,
            lat: track.lat,
            lon: track.lon,
            alt: track.alt,
            speed: track.speed,
            course: track.course,
            heading: track.heading
        });
        keepSizeAt(history, MAX_HISTORY_SIZE);
    };

    var keepSizeAt = function (history, maxSize) {
        while (history.length > maxSize) {
            history.splice(0, 1);
        }
    };

    this.provideHistoryOn = function (callback) {
        for (var key in trackHistory) {
            if (trackHistory.hasOwnProperty(key)) {
                callback(trackHistory[key]);
            }
        }
    };

    this.getTrackById = function (trackId) {
        return trackHistory[trackId];
    };
};

util.inherits(module.exports.TrackHistory, EventEmitter);

