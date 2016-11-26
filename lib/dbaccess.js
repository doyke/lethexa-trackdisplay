

module.exports.DatabaseAccess = function (db, gfs) {

    this.fetchTrackHistory = function (trackId, callback) {
        db.collection('trackhistory').find({trackId: trackId}, {_id: 0, trackId: 0}).toArray(function (err, items) {
            callback(null, items);
        });
    };

    this.fetchAllCurrentTracks = function (callback) {
        db.collection('currenttracks').find({}).toArray(function (err, items) {
            callback(null, items);
        });
    };

    this.fetchCurrentTrackById = function (trackId, callback) {
        db.collection('currenttracks').findOne({_id: trackId}, {_id: 0}).then(
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

    this.fetchCurrentTrackByName = function (name, callback) {
        db.collection('currenttracks').findOne({name: name}, {_id: 0}).then(
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

    this.fetchCurrentTrack = function (trackId, callback) {
        db.collection('currenttracks').findOne({_id: trackId}, {_id: 0}).then(
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
