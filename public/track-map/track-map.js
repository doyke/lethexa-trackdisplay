/* global L */

(function () {

    var trackMap = angular.module('trackMap', [
        'trackAPI'
    ]);

    trackMap.directive('trackMap', function () {
        return {
            require: 'E',
            replace: true,
            controller: 'TrackMapCtrl',
            template: '<div style="width: 100%; height: 100%;"></div>',
            scope: {
                selected: '=?',
                mapcenter: '=?',
                trackFilter: '=?'
            }
        };
    });

    trackMap.controller('TrackMapCtrl', ['$scope', '$trackAPI', '$element', function ($scope, $trackAPI, $element) {
            var openStreetMapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var openSeaMapmUrl = 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png';
            
/*
            $scope.trackFilter = {
                trackIdList: [565589000, 236342000],
                area: [{lat: 53.25, lon: 8.125}, {lat: 53.75, lon: 8.25}]
            };
*/
            var map = L.map($element[0]).setView([53.5, 8.125], 10);
            L.tileLayer(openStreetMapUrl, {
                minZoom: 3,
                attribution: 'Background map &copy; <a href="osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.tileLayer(openSeaMapmUrl, {
                minZoom: 3,
                attribution: 'Overlay map &copy; <a href="http://openseamap.org">OpenSeaMap</a> contributors'
            }).addTo(map);

            var trackPicture = {};
            var trackLayer = L.featureGroup([]);
            trackLayer.addTo(map);

            var createPopupContent = function (track) {
                var result = '';
                result += '<table>';
                result += '<tr><td>TrackId:</td><td>' + track.trackId + '</td></tr>';
                result += '</table>';
                return result;
            };

            $scope.$watch('mapcenter', function (center) {
                if (center === undefined)
                    return;
                map.panTo(new L.LatLng(center.lat, center.lon));
            });

            $scope.$watch('selected', function (track) {
                if (track === undefined) {
                    historyPath.setLatLngs([]);
                }
                else {
                    updateHistoryPath(track.trackId);
                }
            });
            
            $scope.$watch('trackFilter', function (trackFilter) {
                if (!trackFilter)
                    return;
                refilterAll();
            }, true);
            
            var applyFilterToTrackMarker = function(trackMarker, track) {
                if($trackAPI.isTrackInFilter(track, $scope.trackFilter)) {
                    trackMarker.setStyle({
                        fill: true,
                        fillColor: track.color.fill, 
                        fillOpacity: 1.0,
                        stroke: true,
                        color: track.color.line,
                        opacity: 0.5,
                        weight: 1.0
                    });
                }
                else {
                    trackMarker.setStyle({
                        fill: true,
                        fillColor: '#ffffff',
                        fillOpacity: 0.25,
                        stroke: true,
                        color: '#000000',
                        opacity: 0.25,
                        weight: 1.0
                    });
                }
            };
            
            var refilterAll = function() {
                for (var trackId in trackPicture) {
                    if (trackPicture.hasOwnProperty(trackId)) {
                        var trackMarker = trackPicture[trackId];
                        applyFilterToTrackMarker(trackMarker, trackMarker.track);
                    }
                }
            };

            var updateSelectedTrackBy = function (track) {
                var newTrack = {};
                updateParametersFromTo(track, newTrack);
                return newTrack;

                /*
                 return {    
                 trackId: track.trackId,
                 time: units.ABSTIME.asString(track.time),
                 speed: units.SPEED.asString(track.speed),
                 course: units.DIRECTION.asString(track.course),
                 heading: units.DIRECTION.asString(track.heading),
                 lat: units.LATITUDE.asString(track.lat),
                 lon: units.LONGITUDE.asString(track.lon),
                 name: track.name,
                 callsign: track.callsign,
                 dest: track.dest,
                 country: track.country,
                 objlength: track.objlength,
                 objbeam: track.objbeam
                 };*/
            };

            var updateParametersFromTo = function (src, dst) {
                for (var property in src) {
                    if (src.hasOwnProperty(property)) {
                        dst[property] = src[property];
                    }
                }
            };


            var historyPath = L.polyline([], {color: 'blue', clickable: false}).addTo(map);

            var updateHistoryPath = function (trackId) {
                $trackAPI.fetchHistoryPathFor(trackId, function (history) {
                    var linePoints = [];
                    history.forEach(function (state) {
                        linePoints.push(L.latLng(state.lat, state.lon));
                    });
                    try{
                        historyPath.setLatLngs(linePoints);
                    }
                    catch(err) {
                        console.log(err, trackId, linePoints);
                    }
                });
            };
            
            $trackAPI.addListenerFor('clear-picture', function() {
//                console.log('clear-picture');
                for(var trackId in trackPicture) {
                    if(trackPicture.hasOwnProperty(trackId)) {
                        var trackMarker = trackPicture[trackId];
                        trackLayer.removeLayer(trackMarker);
                        delete trackPicture[trackId];
                    }
                }
            });

            $trackAPI.addListenerFor('track-remove', function(track) {
//                console.log('track-remove', track.trackId);
                var trackMarker = trackPicture[track.trackId];
                if(trackMarker) {
                    trackLayer.removeLayer(trackMarker);
                    delete trackPicture[track.trackId];
                }
            });

            $trackAPI.addListenerFor('track-update', function (track) {

                if (trackPicture[track.trackId] === undefined) {

                    if (!track.lat)
                        return;
                    if (!track.lon)
                        return;

                    var trackMarker = L.trackSymbol(L.latLng(track.lat, track.lon), {
                        trackId: track.trackId,
                        fill: true,
                        fillColor: '#ffffff',
                        fillOpacity: 1.0,
                        stroke: true,
                        color: '#000000',
                        opacity: 1.0,
                        weight: 1.0,
                        gpsRefPos: track.gpsRefPos,
                        speed: track.speed === null ? undefined : track.speed,
                        course: track.course === null ? undefined : track.course,
                        heading: track.heading === null ? undefined : track.heading
                    });
                    trackMarker.track = track;
                    applyFilterToTrackMarker(trackMarker, track);
                    trackMarker.on('click', function (event) {
                        var marker = event.target;
                        //console.log('marker', marker);
                        //console.log('scope: ', $scope);
                        $scope.$apply(function () {
                            $scope.selected = updateSelectedTrackBy(trackMarker.track);
                            //updateHistoryPath($scope.selected.trackId);
                        });
                    });

                    trackPicture[track.trackId] = trackMarker;
                    trackMarker.addTo(trackLayer);
                } else {
                    var trackMarker = trackPicture[track.trackId];

                    if (track.lat && track.lon) {
                        trackMarker.setLatLng(L.latLng(track.lat, track.lon));
                    }
                    trackMarker.track = track;
                    applyFilterToTrackMarker(trackMarker, track);
                    trackMarker.setSpeed(track.speed);
                    trackMarker.setCourse(track.course);
                    trackMarker.setHeading(track.heading);
                    trackMarker.setGPSRefPos(track.gpsRefPos);

                    if ($scope.selected === undefined)
                        return;

                    if ($scope.selected.trackId === track.trackId) {
                        $scope.selected = updateSelectedTrackBy(trackMarker.track);
                        //updateHistoryPath(track.trackId);
                    }
                }
                
            });

        }]);

}());

