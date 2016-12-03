var TrackPicture = require('./trackpicture').TrackPicture;

module.exports.registerService = function (app, mq, websocket, dbAccess) {
    var trackPicture = new TrackPicture();

    websocket.on('connected', function (connection) {
        websocket.sendMessageTo(connection, 'clear-picture', {});
        trackPicture.provideTracksOn(function(track) {
            websocket.sendMessageTo(connection, 'track-update', track);
        });
    });

    mq.on('data', function (routingKey, msg) {
        var jsonMsg = JSON.parse(msg);
        if (jsonMsg.header.type === 'track-update') {
            trackPicture.saveTrack(jsonMsg.data);
        }
        if (jsonMsg.header.type === 'track-remove') {
            trackPicture.saveTrack(jsonMsg.data);
        }
        websocket.sendRawMessageToAll(jsonMsg);
    });
/*
    app.get('/track/id/:trackId', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        dbAccess.fetchKnownTrackById(trackId, function(err, foundTrack) {
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
        dbAccess.fetchKnownTrackByName(name, function(err, foundTrack) {
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

    app.get('/track/history/:trackId/route.json', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        dbAccess.fetchTrackHistory(trackId, function(err, history) {
            if (history === undefined)
                res.status(404).send('Track not found !');
            else {
                res.attachment('track' + trackId + '.json');
                res.json(history);
            }
        });
    });

    app.get('/track/history/:trackId/route.gpx', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        dbAccess.fetchTrackHistory(trackId, function(err, history) {
            if (history === undefined)
                res.status(404).send('Track not found !');
            else {
            var filename = 'track' + trackId + '.gpx';
            res.attachment(filename);
            res.send(cvtRouteToGpx(filename, trackId, history, undefined));
            }
        });
    });

    app.get('/track/history/:trackId/route.geojson', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        dbAccess.fetchTrackHistory(trackId, function(err, history) {
            if (history === undefined)
                res.status(404).send('Track not found !');
            else {
            var filename = 'track' + trackId + '.geojson';
            res.attachment(filename);
            res.send(cvtRouteToGeoJson(trackId, history, undefined));
            }
        });
    });

    var cvtTimeToIso8601 = function(time) {
        var date = new Date(time);
        return date.toISOString(); 
    };

    var cvtRouteToGpx = function (filename, trackId, history, trackInfo) {
        var result = '';
        result += '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n\n';
        result += '<gpx version="1.1" creator="Lethexa via lethexa-trackdisplay">\n';
        result += '  <metadata>\n';
        result += '    <name>' + filename + '</name>\n';
        result += '    <desc>Recorded route of ' + trackId + '</desc>\n';
        result += '    <author>\n';
        result += '      <name>Lethexa</name>\n';        
        result += '    </author>\n';
        result += '  </metadata>\n';
        result += '  <trk>\n';
        if(trackInfo && trackInfo.name) {
            result += '    <name>' + trackInfo.name + ' (' + trackId + ')</name>\n';
        }
        else {
            result += '    <name>' + trackId + '</name>\n';
        }
        result += '    <trkseg>\n';
        history.forEach(function (point) {
            result += '      <trkpt lat="' + point.lat + '" lon="' + point.lon + '">\n';
            result += '        <time>' + cvtTimeToIso8601(point.lastctc) + '</time>\n';
            result += '        <ele>' + (point.alt || 0.0) + '</ele>\n';
            result += '      </trkpt>\n';
        });
        result += '    </trkseg>\n';
        result += '  </trk>\n';
        result += '</gpx>\n';
        return result;
    };

    var cvtRouteToGeoJson = function (trackId, history, trackInfo) {
        var coords = [];
        history.forEach(function (point) {
            coords.push([point.lon, point.lat]);
        });
        
        var name = '' + trackId; 
        if(trackInfo && trackInfo.name) {
            name = '' + trackInfo.name + ' (' + trackId + ')';
        }

        var msg = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    id: trackId,
                    geometry: {
                        type: 'LineString',
                        coordinates: coords
                    },
                    properties: {
                        trackId: trackId,
                        name: name
                    }
                }
            ]
        };
        return msg;
    };

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
*/    
    console.log('register Trackservice');
};