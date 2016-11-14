/* global units */

(function () {

    var waitDialog = angular.module('waitDialog', [
    ]);

    waitDialog.directive('waitDialog', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                dialogVisible: '=',
                message: '@'
            },
            templateUrl: 'wait-dialog/wait-dialog.html',
            controller: 'WaitDialogCtrl'
        };
    });

    waitDialog.controller('WaitDialogCtrl', ['$scope', '$element', function ($scope, $element) {
            var elementId = '#' + $element[0].id;

            $(elementId).modal({
                backdrop: 'static',
                keyboard: false 
            });
            
            $scope.$watch('dialogVisible', function(dialogVisible) {
                $(elementId).modal(dialogVisible ? 'show' : 'hide');
            });
        }]);

}());

