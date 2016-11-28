/* global units, geo */

(function () {

    var trackInfo = angular.module('trackInfo', [
        'trackAPI',
        'photoList',
        'inputText',
        'inputNumber',
        'inputUnit',
        'ngFileUpload'
    ]);

    trackInfo.directive('trackInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selected: '=?',
                mapcenter: '=?',
                trackFilter: '=?',
                units: '=?',
                editable: '=?'
            },
            templateUrl: 'track-info/track-info.html',
            controller: 'TrackInfoCtrl'
        };
    });

    trackInfo.controller('TrackInfoCtrl', ['$scope', '$trackAPI', function ($scope, $trackAPI) {
            $scope.cvtLatitudeToDegMinSec = geo.cvtLatitudeToDegMinSec;
            $scope.cvtLongitudeToDegMinSec = geo.cvtLongitudeToDegMinSec;
            $scope.countryName = '';

            $scope.$watch('selected', function (selected) {
                if (!selected)
                    $scope.countryName = '';
                else
                    $scope.countryName = $trackAPI.getCountryFor(selected.country);
            });

            $scope.filterByMMSI = function () {
                if (!$scope.selected)
                    return;
                $scope.trackFilter = {
                    trackIdList: [$scope.selected.trackId]
                };
            };

            $scope.recenter = function () {
                console.log('trackInfo:center');
                var track = $scope.selected;
                if (track === undefined)
                    return;
                $scope.mapcenter = track;
            };

            $scope.getFlagClass = function (value) {
                if (value === undefined)
                    return undefined;
                if (value === 'xx')
                    return undefined;
                return 'flag flag-' + value;
            };

            $scope.cvtTime = function (value) {
                if (value === undefined)
                    return undefined;
                var date = new Date(value);
                return date.toISOString();
            };

            $scope.cvtPosition = function (lat, lon) {
                var latString = '--';
                var lonString = '--';
                if (lat !== undefined) {
                    latString = units.LATITUDE.asString(lat);
                }
                if (lon !== undefined) {
                    lonString = units.LONGITUDE.asString(lon);
                }
                return latString + ', ' + lonString;
            };

            $scope.cvtLatitude = function (value) {
                if (value === undefined)
                    return undefined;
                return units.LATITUDE.asString(value);
            };

            $scope.cvtLongitude = function (value) {
                if (value === undefined)
                    return undefined;
                return units.LONGITUDE.asString(value);
            };

            $scope.cvtRoteOfTurn = function (value) {
                if (value === undefined)
                    return undefined;
                return units.ROTSPEED.asString(value);
            };

            $scope.cvtDirection = function (value) {
                if (value === undefined)
                    return undefined;
                return units.DIRECTION.asString(value);
            };

            $scope.cvtSpeed = function (value) {
                if (value === undefined)
                    return undefined;
                return units.SPEED.asString(value * 0.514444);
            };

            $scope.cvtLength = function (value) {
                if (value === undefined)
                    return undefined;
                return units.LENGTH.asString(value);
            };

            $scope.cvtDimensions = function (len, beam) {
                if (len === undefined && beam === undefined)
                    return undefined;
                var lenString = len !== undefined ? units.LENGTH.asString(len) : '--';
                var beamString = beam !== undefined ? units.LENGTH.asString(beam) : '--';
                return lenString + ' x ' + beamString;
            };

            $scope.cvtType = function (type) {
                if (type === undefined)
                    return undefined;
                var generalString = type.general !== undefined ? type.general : 'Unknown';
                var categoryString = type.category !== undefined ? type.category : 'Unknown';
                var specificString = type.specific !== undefined ? type.specific : 'Unknown';
                return generalString.toUpperCase() + ', ' + categoryString.toUpperCase() + ', ' + specificString.toUpperCase();
            };

        }]);

}());

