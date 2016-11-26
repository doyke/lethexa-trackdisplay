var utils = require('./utils');

module.exports.registerService = function (app, trackPicture, dbAccess) {
    console.log('register Trackservice');

    app.get('/track/id/:trackId', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        dbAccess.fetchCurrentTrackById(trackId, function(err, foundTrack) {
            if(err) {
                console.log(err);
                res.status(500).send('Internal error !');
                return;
            }
            if (foundTrack === undefined)
                res.status(404).send('Track not found !');
            else
                res.json(foundTrack);
        });
    });

    app.get('/track/name/:name', function (req, res) {
        var name = utils.trimLine(req.params.name ? req.params.name : '').toUpperCase();
        dbAccess.fetchCurrentTrackByName(name, function(err, foundTrack) {
            if(err) {
                console.log(err);
                res.status(500).send('Internal error !');
                return;
            }
            if (foundTrack === undefined)
                res.status(404).send('Track not found !');
            else
                res.json(foundTrack);
        });
    });

    app.get('/track/picture.json', function (req, res) {
        dbAccess.fetchAllCurrentTracks(function(err, tracks) {
            if(err) {
                console.log(err);
                res.status(500).send('Internal error !');
                return;
            }
            res.json(tracks);
        });
    });

    app.get('/track/picture.geojson', function (req, res) {
        dbAccess.fetchAllCurrentTracks(function(err, tracks) {
            if(err) {
                console.log(err);
                res.status(500).send('Internal error !');
                return;
            }
            res.json(cvtTracksToGeoJson(tracks));
        });
    });

    var cvtTracksToGeoJson = function (tracks) {
        var msg = {
            type: 'FeatureCollection',
            features: []
        };

        tracks.forEach(function (track) {
            msg.features.push({
                type: 'Feature',
                id: track.trackId,
                geometry: {
                    type: 'Point',
                    coordinates: [track.lon, track.lat]
                },
                properties: {
                    trackId: track.trackId,
                    name: track.name
                }
            });
        });
        return msg;
    };
};