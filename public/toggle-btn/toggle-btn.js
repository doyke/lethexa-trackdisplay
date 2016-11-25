(function () {

    var toggleBtn = angular.module('toggleBtn', [
    ]);

    toggleBtn.directive('toggleBtn', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                enabled: '=?',
                enabledIcon: '@',
                disabledIcon: '@'
            },
            templateUrl: 'toggle-btn/toggle-btn.html',
            controller: 'ToggleBtnCtrl'
        };
    });

    toggleBtn.controller('ToggleBtnCtrl', ['$scope', function ($scope) {
            $scope.enabledIcon = $scope.enabledIcon || 'fa-plus-circle';
            $scope.disabledIcon = $scope.disabledIcon || 'fa-minus-circle';
        }]);

}());

