(function () {

    var inputNumber = angular.module('inputNumber', [
    ]);

    inputNumber.directive('inputNumber', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholder: '@',
                min: '@',
                max: '@',
                step: '@',
                editable: '=?'
            },
            templateUrl: 'input-number/input-number.html',
            controller: 'InputNumberCtrl'
        };
    });

    inputNumber.controller('InputNumberCtrl', ['$scope', function ($scope) {
    }]);

}());

