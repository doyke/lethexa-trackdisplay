(function () {

    var playerCtrl = angular.module('playerCtrl', [
    ]);

    playerCtrl.directive('playerCtrl', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                showPlay: '@',
                showPause: '@',
                showStop: '@',
                showStepbackward: '@',
                showFastbackward: '@',
                showBackward: '@',
                showForward: '@',
                showFastforward: '@',
                showStepforward: '@',
                ngPlay: '&',
                ngPause: '&',
                ngStop: '&',
                ngStepbackward: '&',
                ngFastbackward: '&',
                ngBackward: '&',
                ngForward: '&',
                ngFastforward: '&',
                ngStepforward: '&'
            },
            templateUrl: 'player-ctrl/player-ctrl.html',
            controller: 'PlayerCtrlCtrl'
        };
    });

    playerCtrl.controller('PlayerCtrlCtrl', ['$scope', function ($scope) {
            $scope.playDisabled = false;
            $scope.pauseDisabled = true;
            $scope.stopDisabled = true;
            
            var switchRunning = function() {
            };

            $scope.clickPlay = function () {
                $scope.playDisabled = true;
                $scope.pauseDisabled = false;
                $scope.stopDisabled = false;
                $scope.stepBwdDisabled = true;
                $scope.fastBwdDisabled = true;
                $scope.bwdDisabled = true;
                $scope.fwdDisabled = true;
                $scope.fastFwdDisabled = true;
                $scope.stepFwdDisabled = true;
                $scope.ngPlay();
            };

            $scope.clickPause = function () {
                $scope.playDisabled = false;
                $scope.pauseDisabled = true;
                $scope.stopDisabled = false;
                $scope.stepBwdDisabled = true;
                $scope.fastBwdDisabled = true;
                $scope.bwdDisabled = true;
                $scope.fwdDisabled = true;
                $scope.fastFwdDisabled = true;
                $scope.stepFwdDisabled = true;
                $scope.ngPause();
            };

            $scope.clickStop = function () {
                $scope.playDisabled = false;
                $scope.pauseDisabled = true;
                $scope.stopDisabled = true;
                $scope.stepBwdDisabled = false;
                $scope.fastBwdDisabled = false;
                $scope.bwdDisabled = false;
                $scope.fwdDisabled = false;
                $scope.fastFwdDisabled = false;
                $scope.stepFwdDisabled = false;
                $scope.ngStop();
            };

            $scope.clickStepbackward = function () {
                $scope.ngStepbackward();
            };

            $scope.clickFastbackward = function () {
                $scope.ngFastbackward();
            };

            $scope.clickBackward = function () {
                $scope.ngBackward();
            };

            $scope.clickForward = function () {
                $scope.ngForward();
            };

            $scope.clickFastforward = function () {
                $scope.ngFastforward();
            };

            $scope.clickStepforward = function () {
                $scope.ngStepforward();
            };

        }]);

}());

