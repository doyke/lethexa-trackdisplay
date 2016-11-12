
module.exports.registerService = function (app, trackHistory) {
    console.log('register Historyservice');

    app.get('/trackhistory/:trackId', function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        var track = trackHistory.getTrackById(trackId);
        if (track === undefined)
            res.status(404).send('Track not found !');
        res.json(track);
    });
};