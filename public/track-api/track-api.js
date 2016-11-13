(function () {
    var trackAPI = angular.module('trackAPI', [
        'wsAPI'
    ]);

    trackAPI.factory('$trackAPI', ['$wsAPI', '$http', function ($wsAPI, $http) {
            var isTrackInTrackIdList = function (track, trackIdList) {
                if (!trackIdList)
                    return true;
                return trackIdList.indexOf(track.trackId) >= 0;
            };

            var isTrackNameFound = function (track, trackName) {
                if (!trackName)
                    return true;
                if (!track.name)
                    return false;
                return track.name.indexOf(trackName) === 0;
            };

            var isTrackInArea = function (track, area) {
                if (!area)
                    return true;
                var pos1 = area[0];
                var pos2 = area[1];
                return (track.lat >= pos1.lat) && (track.lat <= pos2.lat) && (track.lon >= pos1.lon) && (track.lon <= pos2.lon);
            };

            return {
                isTrackFilteredOut: function (track, trackFilter) {
                    if (!trackFilter)
                        return false;
                    if (!isTrackInArea(track, trackFilter.area))
                        return true;
                    if (!isTrackInTrackIdList(track, trackFilter.trackIdList))
                        return true;
                    if(!isTrackNameFound(track, trackFilter.trackName))
                        return true;
                    return false;
                },

                fetchTrackFor: function (trackId, callback) {
                    if (isNaN(trackId)) {
                        $http.get('/track/name/' + trackId).then(
                                function successCallback(response) {
                                    callback(response.data);
                                },
                                function errorCallback(response) {
                                }
                        );
                    } else {
                        $http.get('/track/id/' + trackId).then(
                                function successCallback(response) {
                                    callback(response.data);
                                },
                                function errorCallback(response) {
                                }
                        );
                    }
                },

                fetchTrackByName: function (name, callback) {
                    $http.get('/track/name/' + name).then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                },

                fetchHistoryPathFor: function (trackId, callback) {
                    $http.get('/trackhistory/' + trackId).then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                },

                addListenerFor: $wsAPI.addListenerFor,
                removeListenerFor: $wsAPI.removeListenerFor

            };
        }]);

}());
