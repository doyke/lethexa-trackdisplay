(function () {

    var inputTime = angular.module('inputTime', [
    ]);

    inputTime.directive('inputTime', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholder: '@',
                editable: '=?'
            },
            templateUrl: 'input-time/input-time.html',
            controller: 'InputTimeCtrl'
        };
    });

    inputTime.controller('InputTimeCtrl', ['$scope', function ($scope) {
        }]);

}());

