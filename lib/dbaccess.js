
module.exports.DatabaseAccess = function (db, gfs) {
    this.saveTrackInMongoDB = function (track) {
        if (!db)
            return false;
        db.collection('trackhistory').save(track, function (err, result) {
            if (err)
                console.log(err);
        });

        track._id = track.trackId; // track.header.src + '_' + track.trackId;
        delete track.header;
        db.collection('currenttracks').save(track, function (err, result) {
            if (err)
                console.log(err);
        });
        db.collection('knowntracks').save(track, function (err, result) {
            if (err)
                console.log(err);
        });
    };

    this.removeTrackFromMongoDB = function (track) {
        if (!db)
            return false;
        db.collection('currenttracks').remove({_id: track.trackId}, function (err, result) {
            if (err)
                console.log(err);
        });
    };

    this.fetchTrackHistory = function (trackId, callback) {
        db.collection('trackhistory').find({trackId: trackId}, {_id: 0, trackId: 0}).toArray(function (err, items) {
            if (err)
                console.log(err);
            if (callback)
                callback(err, items);
        });
    };

    this.fetchAllCurrentTracks = function (callback) {
        db.collection('currenttracks').find({}).toArray(function (err, items) {
            if (callback)
                callback(null, items);
        });
    };

    this.fetchKnownTrackById = function (trackId, callback) {
        db.collection('knowntracks').findOne({_id: trackId}, {_id: 0}).then(
                function success(data) {
                    if (data !== null) {
                        if (callback)
                            callback(null, data);
                    }
                },
                function fail(err) {
                    if (callback)
                        callback(err);
                }
        );
    };

    this.fetchKnownTrackByName = function (name, callback) {
        db.collection('knowntracks').findOne({name: name}, {_id: 0}).then(
                function success(data) {
                    if (data !== null) {
                        if (callback)
                            callback(null, data);
                    }
                },
                function fail(err) {
                    if (callback)
                        callback(err);
                }
        );
    };

    this.fetchKnownTrack = function (trackId, callback) {
        db.collection('knowntracks').findOne({_id: trackId}, {_id: 0}).then(
                function success(data) {
                    if (data !== null) {
                        if (callback)
                            callback(null, data);
                    }
                },
                function fail(err) {
                    if (callback)
                        callback(err);
                }
        );
    };
};
