(function () {

    var inputText = angular.module('inputText', [
    ]);

    inputText.directive('inputText', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholder: '@',
                editable: '=?'
            },
            templateUrl: 'input-text/input-text.html',
            controller: 'InputTextCtrl'
        };
    });

    inputText.controller('InputTextCtrl', ['$scope', function ($scope) {
        }]);

}());

