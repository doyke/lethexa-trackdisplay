(function () {

    var inputDate = angular.module('inputDate', [
    ]);

    inputDate.directive('inputDate', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholder: '@',
                editable: '=?'
            },
            templateUrl: 'input-date/input-date.html',
            controller: 'InputDateCtrl'
        };
    });

    inputDate.controller('InputDateCtrl', ['$scope', function ($scope) {
        }]);

}());

