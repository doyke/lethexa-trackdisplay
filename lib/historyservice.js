
module.exports.registerService = function (app, trackHistory, trackPicture) {
    console.log('register Historyservice');

    app.get('/trackhistory/:trackId/route.json', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var history = trackHistory.getTrackById(trackId);
        if (history === undefined)
            res.status(404).send('Track not found !');
        else {
            res.attachment('track' + trackId + '.json');
            res.json(history);
        }
    });

    app.get('/trackhistory/:trackId/route.gpx', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var trackInfo = trackPicture.getTrackById(trackId);
        var history = trackHistory.getTrackById(trackId);
        if (history === undefined)
            res.status(404).send('Track not found !');
        else {
            var filename = 'track' + trackId + '.gpx';
            res.attachment(filename);
            res.send(cvtRouteToGpx(filename, trackId, history, trackInfo));
        }
    });

    app.get('/trackhistory/:trackId/route.geojson', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var trackInfo = trackPicture.getTrackById(trackId);
        var history = trackHistory.getTrackById(trackId);
        if (history === undefined)
            res.status(404).send('Track not found !');
        else {
            res.attachment('track' + trackId + '.geojson');
            res.json(cvtRouteToGeoJson(trackId, history, trackInfo));
        }
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
            result += '        <time>' + cvtTimeToIso8601(point.time) + '</time>\n';
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
};