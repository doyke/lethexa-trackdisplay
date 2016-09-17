var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports.TrackPicture = function() {
  var trackPicture = {};

  EventEmitter.call(this);

  this.saveTrack = function(track) {
    var trackId = track.trackId;
    trackPicture[trackId] = track;
  };

  this.provideTracksOn = function(callback) {
    for(key in trackPicture) {
      if(trackPicture.hasOwnProperty(key)) {
        callback(trackPicture[key]);
      }
    }
  };
};

util.inherits(module.exports.TrackPicture, EventEmitter);

