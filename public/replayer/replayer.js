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
                var requestData = { 
                    startTime: $scope.startTime, 
                    endTime: $scope.endTime, 
                    trackIds: $scope.trackIdList
                };
                console.log('start replay', requestData);
                $wsAPI.send('start-replay', requestData);
            };

            $scope.pauseReplay = function() {
                console.log('pause replay');
                $wsAPI.send('pause-replay', {});
            };

            $scope.stopReplay = function() {
                console.log('stop replay');
                $wsAPI.send('stop-replay', {});
            };
            
            $scope.exportPicture = function() {
                
            };
        }]);

}());

