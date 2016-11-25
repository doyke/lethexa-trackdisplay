(function () {

    var inputDatetime = angular.module('inputDatetime', [
        'inputDate',
        'inputTime'
    ]);

    inputDatetime.directive('inputDatetime', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                placeholderDate: '@',
                placeholderTime: '@'
            },
            templateUrl: 'input-datetime/input-datetime.html',
            controller: 'InputDatetimeCtrl'
        };
    });

    inputDatetime.controller('InputDatetimeCtrl', ['$scope', function ($scope) {
            $scope.$watch('dateModel', function(newDate) {
                console.log(newDate);
            });

            $scope.$watch('timeModel', function(newTime) {
                console.log(newTime);
            });
            
        }]);

}());

