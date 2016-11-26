/* global units */

(function () {

    var photoUpload = angular.module('photoUpload', [
        'photoAPI',
        'toggleBtn'
    ]);

    photoUpload.directive('photoUpload', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selected: '=',
                mapcenter: '='
            },
            templateUrl: 'photo-upload/photo-upload.html',
            controller: 'PhotoUploadCtrl'
        };
    });

    photoUpload.controller('PhotoUploadCtrl', ['$scope', '$photoAPI', function ($scope, $photoAPI) {
    }]);
}());

