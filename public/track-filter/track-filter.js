/* global units */

(function () {

    var trackFilter = angular.module('trackFilter', [
        'selectOperation'
    ]);

    trackFilter.directive('trackFilter', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                trackFilter: '=',
                units: '=?'
            },
            templateUrl: 'track-filter/track-filter.html',
            controller: 'TrackFilterCtrl'
        };
    });

    trackFilter.controller('TrackFilterCtrl', ['$scope', function ($scope) {
            $scope.clearAllFilter = function () {
                $scope.trackFilter = {};
            };
            
            $scope.operators = [
                '<',
                '=',
                '>'
            ];
        }]);

}());

