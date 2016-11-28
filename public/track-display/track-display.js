(function () {

    var app = angular.module('trackDisplay', [
        'trackAPI',
        'trackMap',
        'trackList',
        'trackInfo',
        'trackFilter',
        'trackMessage',
        'trackSearch',
        'replayer',
        'photoUpload',
        'waitDialog'
    ]);

    app.directive('trackDisplay', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'track-display/track-display.html',
            controller: 'TrackDisplayCtrl'
        };
    });

    app.controller('TrackDisplayCtrl', ['$scope', '$trackAPI', function ($scope, $trackAPI) {

            $trackAPI.addListenerFor('ws-connected', function () {
                $scope.$apply(function () {
                    $scope.waitVisible = false;
                });
            });

            $trackAPI.addListenerFor('ws-disconnected', function () {
                $scope.$apply(function () {
                    $scope.waitVisible = true;
                });
            });

            $scope.tabName = "tab1";

            $scope.units = $scope.units || {
                length: {
                    unitFactor: 1.0,
                    unit: 'm',
                    unitName: 'meters'
                },
                depth: {
                    unitFactor: 1.0,
                    unit: 'm',
                    unitName: 'meters'
                },
                speed: {
                    unitFactor: (1852 / 3600),
                    unit: 'm/s',
                    unitName: 'meters per second'
                },
                direction: {
                    unitFactor: (180.0 / Math.PI),
                    unit: '°',
                    unitName: 'Degree'
                },
                turnrate: {
                    unitFactor: 1.0,
                    unit: '°/s',
                    unitName: 'Degree per second'
                }
            };
        }]);

}());

