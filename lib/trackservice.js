var utils = require('./utils');

module.exports.registerService = function (app, trackPicture) {
    console.log('register Trackservice');

    app.get('/track/id/:trackId', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var track = trackPicture.getTrackById(trackId);
        if (track === undefined)
            res.status(404).send('Track not found !');
        else
            res.json(track);
    });

    app.get('/track/name/:name', function (req, res) {
        var name = utils.trimLine(req.params.name ? req.params.name : '').toLowerCase();
        var foundTrack = undefined;
        trackPicture.forEach(function(track) {
            var trackName = utils.trimLine(track.name ? track.name : '').toLowerCase();
            if(trackName === name) {
                foundTrack = track;
            }
        });
        if (foundTrack === undefined)
            res.status(404).send('Track not found !');
        else
            res.json(foundTrack);
    });
};