/* global units, geo */

(function () {

    var trackInfo = angular.module('trackInfo', [
        'trackAPI',
        'photoAPI',
        'ngFileUpload'
    ]);

    trackInfo.directive('trackInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selected: '=?',
                mapcenter: '=?',
                trackFilter: '=?'
            },
            templateUrl: 'track-info/track-info.html',
            controller: 'TrackInfoCtrl'
        };
    });

    trackInfo.controller('TrackInfoCtrl', ['$scope', '$trackAPI', '$photoAPI', '$timeout', 'Upload', function ($scope, $trackAPI, $photoAPI, $timeout, Upload) {
            $scope.cvtLatitudeToDegMinSec = geo.cvtLatitudeToDegMinSec;
            $scope.cvtLongitudeToDegMinSec = geo.cvtLongitudeToDegMinSec;
            $scope.photos = [];
            $scope.countryName = '';

            $scope.$watch('selected', function (item) {
                if (item === undefined) {
                    $scope.photos = [];
                } else {
                    $photoAPI.fetchPhotos($scope.selected.trackId, function (list) {
                        $scope.photos = list;
                    });
                }
            });

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


            $scope.photoUrl = '';
            $scope.photoFilename = '';
            $scope.uploading = false;

            $scope.clickImage = function(photo) {
                $scope.photoUrl = '/photos/' + photo._id;
                $scope.photoFilename = photo.filename;
            };

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });
            $scope.$watch('file', function () {
                if ($scope.file !== null) {
                    $scope.files = [$scope.file];
                }
            });
            $scope.log = '';

            $scope.upload = function (files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        if(!file)
                            continue;
                        if (!file.$error) {
                            $scope.uploading = true;
                            $scope.percentComplete = 0;
                            Upload.upload({
                                url: '/photos/' + $scope.selected.trackId,
                                data: {
                                    recfile: file
                                }
                            }).then(function (resp) {
                                $timeout(function () {
                                    $scope.percentComplete = 100;
                                    $scope.uploading = false;
                                    
                                    $scope.log = 'file: ' +
                                            resp.config.data.recfile.name +
                                            ', Response: ' + JSON.stringify(resp.data) +
                                            '\n' + $scope.log;
                                });
                            }, null, function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.percentComplete = progressPercentage;
                                
                                $scope.log = 'progress: ' + progressPercentage +
                                        '% ' + evt.config.data.recfile.name + '\n' +
                                        $scope.log;
                            });
                        }
                    }
                }
            };


        }]);

}());

