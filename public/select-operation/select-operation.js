(function () {

    var selectOperation = angular.module('selectOperation', [
    ]);

    selectOperation.directive('selectOperation', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?'
            },
            templateUrl: 'select-operation/select-operation.html',
            controller: 'SelectOperationCtrl'
        };
    });

    selectOperation.controller('SelectOperationCtrl', ['$scope', function ($scope) {

            $scope.operators = [
                '<',
                '=',
                '>'
            ];

        }]);

}());
