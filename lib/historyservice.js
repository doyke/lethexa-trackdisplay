
module.exports.registerService = function (app, trackHistory) {
    console.log('register Historyservice');

    app.get('/trackhistory/:trackId/route.json', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var track = trackHistory.getTrackById(trackId);
        if (track === undefined)
            res.status(404).send('Track not found !');
        else {
            res.attachment('track' + trackId + '.json');
            res.json(track);
        }
    });

    app.get('/trackhistory/:trackId/route.gpx', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var track = trackHistory.getTrackById(trackId);
        if (track === undefined)
            res.status(404).send('Track not found !');
        else {
            res.attachment('track' + trackId + '.gpx');
            res.send(cvtRouteToGpx(trackId, track));
        }
    });

    app.get('/trackhistory/:trackId/route.geojson', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var track = trackHistory.getTrackById(trackId);
        if (track === undefined)
            res.status(404).send('Track not found !');
        else {
            res.attachment('track' + trackId + '.geojson');
            res.json(cvtRouteToGeoJson(trackId, track));
        }
    });

    var cvtRouteToGpx = function (trackId, trackhistory) {
        var result = '';
        result += '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n\n';
        result += '<gpx version="1.1" creator="Tim Leerhoff">\n';
        result += '  <metadata></metadata>\n';
        result += '  <trk>\n';
        result += '    <name>' + trackId + '</name>\n';
        result += '    <trkseg>\n';
        trackhistory.forEach(function (point) {
            result += '      <trkpt lat="' + point.lat + '" lon="' + point.lon + '"></trkpt>\n';
        });
        result += '    </trkseg>\n';
        result += '  </trk>\n';
        result += '</gpx>\n';
        return result;
    };

    var cvtRouteToGeoJson = function (trackId, trackhistory) {
        var coords = [];
        trackhistory.forEach(function (point) {
            coords.push(point.lat);
            coords.push(point.lon);
        });

        var msg = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    id: trackId,
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: {
                        trackId: trackId,
                        name: '' + trackId
                    }
                }
            ]
        };
        return msg;
    };
};