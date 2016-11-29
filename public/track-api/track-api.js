(function () {
    var trackAPI = angular.module('trackAPI', [
        'settings',
        'wsAPI'
    ]);

    trackAPI.factory('$trackAPI', ['$wsAPI', '$http', '$settings', function ($wsAPI, $http, $settings) {
            var countries;

            var fetchCountries = function () {
                $http.get($settings.getTerrainServerUrl() + '/country').then(
                        function (response) {
                            countries = response.data;
                        }, function(err) {
                            console.log('Problem loading countries', err);
                        });
            };

            fetchCountries();

            var isTrackInTrackIdList = function (track, trackIdList) {
                if (!trackIdList)
                    return true;
                return trackIdList.indexOf(track.trackId) >= 0;
            };

            var checkStringExpression = function (trackAttr, value) {
                if (value === undefined)
                    return true;
                if (value === '')
                    return true;
                if (trackAttr === undefined)
                    return false;
                return trackAttr.toLowerCase().indexOf(value.toLowerCase()) === 0;
            };

            var checkIfExpression = function (trackAttr, expression) {
                if (expression === undefined)
                    return true;
                if (!expression.value)
                    return true;
                if (!expression.op)
                    return true;
                if (trackAttr === undefined)
                    return false;
                var result = true;
                if (expression.op === '<')
                    result = trackAttr < expression.value;
                else if (expression.op === '>')
                    result = trackAttr > expression.value;
                else if (expression.op === '=')
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
                isTrackInFilter: function (track, trackFilter) {
                    if (!trackFilter)
                        return true;
                    var result = true;
                    result = result && isTrackInArea(track, trackFilter.area);
                    result = result && isTrackInTrackIdList(track, trackFilter.trackIdList);
                    result = result && checkStringExpression(track.name, trackFilter.trackName);
                    result = result && checkStringExpression(track.callsign, trackFilter.callsign);
                    result = result && checkStringExpression(track.dest, trackFilter.destination);
                    result = result && checkIfExpression(track.speed, trackFilter.speed);
                    result = result && checkIfExpression(track.draught, trackFilter.draught);
                    result = result && checkIfExpression(track.objlength, trackFilter.length);
                    result = result && checkIfExpression(track.objbeam, trackFilter.beam);
                    return result;
                },

                fetchTrackFor: function (trackId, callback, errorCallback) {
                    if (isNaN(trackId)) {
                        $http.get($settings.getStorageServerUrl() + '/track/name/' + trackId).then(
                                function (response) {
                                    callback(response.data);
                                },
                                function (response) {
                                    errorCallback(response);
                                }
                        );
                    } else {
                        $http.get($settings.getStorageServerUrl() + '/track/id/' + trackId).then(
                                function (response) {
                                    callback(response.data);
                                },
                                function (response) {
                                    errorCallback(response);
                                }
                        );
                    }
                },

                fetchTrackByName: function (name, callback) {
                    $http.get($settings.getStorageServerUrl() + '/track/name/' + name).then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                },

                fetchHistoryPathFor: function (trackId, callback) {
                    $http.get($settings.getStorageServerUrl() + '/track/history/' + trackId + '/route.json').then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                },

                getCountryFor: function (code) {
                    if (countries === undefined) {
                        fetchCountries();
                        return 'Loading...';
                    }
                    code = code ? code.toUpperCase() : 'XX';
                    return countries[code];
                },

                addListenerFor: $wsAPI.addListenerFor,
                removeListenerFor: $wsAPI.removeListenerFor

            };
        }]);

}());
