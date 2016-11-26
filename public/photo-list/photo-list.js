/* global units */

(function () {

    var photoList = angular.module('photoList', [
        'photoAPI',
        'toggleBtn'
    ]);

    photoList.directive('photoList', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selected: '=',
                mapcenter: '='
            },
            templateUrl: 'photo-list/photo-list.html',
            controller: 'PhotoListCtrl'
        };
    });

    photoList.controller('PhotoListCtrl', ['$scope', '$photoAPI', function ($scope, $photoAPI) {
            $scope.photos = [];

            $scope.$watch('selected', function (item) {
                if (item === undefined) {
                    $scope.photos = [];
                } else {
                    $photoAPI.fetchPhotos($scope.selected.trackId, function (list) {
                        console.log(list);
                        $scope.photos = list;
                    });
                }
            });
    }]);
}());

