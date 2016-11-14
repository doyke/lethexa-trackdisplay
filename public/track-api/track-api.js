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

            var checkStringExpression = function (trackAttr, value) {
                if (value === undefined)
                    return true;
                if (trackAttr === undefined)
                    return false;
                return trackAttr.toLowerCase().indexOf(value.toLowerCase()) === 0;
            };

            var checkIfExpression = function (trackAttr, expression) {
                if (trackAttr === undefined)
                    return false;
                if (!expression)
                    return true;
                if (!expression.value)
                    return true;
                if (!expression.op)
                    return true;
                var result = true;
                if(expression.op === '<')
                    result = trackAttr < expression.value;
                else if(expression.op === '>')
                    result = trackAttr > expression.value;
                else if(expression.op === '=')
                    result = trackAttr === expression.value;
                return result;
            };

            var isTrackInArea = function (track, area) {
                if (area === undefined)
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
                    if(!checkStringExpression(track.name, trackFilter.trackName))
                        return true;
                    if(!checkIfExpression(track.draught, trackFilter.draught))
                        return true;
                    if(!checkIfExpression(track.objlength, trackFilter.length))
                        return true;
                    if(!checkIfExpression(track.objbeam, trackFilter.beam))
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
