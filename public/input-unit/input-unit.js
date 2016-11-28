(function () {

    var inputUnit = angular.module('inputUnit', [
    ]);

    inputUnit.directive('inputUnit', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholder: '@',
                unit: '@',
                unitFactor: '=?',
                min: '@',
                max: '@',
                step: '@',
                editable: '=?'
            },
            templateUrl: 'input-unit/input-unit.html',
            controller: 'InputUnitCtrl'
        };
    });

    inputUnit.controller('InputUnitCtrl', ['$scope', function ($scope) {
            $scope.unitFactor = $scope.unitFactor || 1.0;
            $scope.step = $scope.step || 1.0;

            $scope.$watch('ngModel', function (modelValue) {
                if (modelValue === undefined) {
                    $scope._internalModelValue = undefined;
                } else {
                    var value = modelValue * $scope.unitFactor;
                    value = Math.floor(value / $scope.step) * $scope.step;
                    $scope._internalModelValue = value;
                    //console.log('$scope._internalModelValue', $scope._internalModelValue, $scope.unitFactor, $scope.unit);
                }
            });

            $scope.$watch('_internalModelValue', function (modelValue) {
                if (modelValue === undefined) {
                    $scope.ngModel = undefined;
                } else {
                    var value = modelValue / $scope.unitFactor;
                    $scope.ngModel = value;
                }
            });
        }]);

}());

