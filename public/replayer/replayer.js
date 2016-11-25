/* global units */

(function () {

    var replayer = angular.module('replayer', [
        'toggleBtn',
        'inputDatetime',
        'inputDate',
        'inputTime',
        'playerCtrl',
        'wsAPI'
    ]);

    replayer.directive('replayer', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                trackIdList: '=?'
            },
            templateUrl: 'replayer/replayer.html',
            controller: 'ReplayerCtrl'
        };
    });

    replayer.controller('ReplayerCtrl', ['$scope', '$wsAPI', function ($scope, $wsAPI) {
            
            $scope.trackIdList = [];
            
            $scope.startReplay = function() {
                console.log('start replay');
                $wsAPI.send('start-replay', { startTime: $scope.startDate, endTime: $scope.endDate, trackIds: $scope.trackIdList});
            };

            $scope.pauseReplay = function() {
                console.log('pause replay');
                $wsAPI.send('pause-replay', {});
            };

            $scope.stopReplay = function() {
                console.log('stop replay');
                $wsAPI.send('stop-replay', {});
            };
        }]);

}());

