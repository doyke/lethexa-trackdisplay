/* global units, geo */

(function () {

    var photoList = angular.module('photoList', [
        'photoAPI',
        'ngFileUpload'
    ]);

    photoList.directive('photoList', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selected: '=?',
                editable: '=?'
            },
            templateUrl: 'photo-list/photo-list.html',
            controller: 'PhotoListCtrl'
        };
    });

    photoList.controller('PhotoListCtrl', ['$scope', '$photoAPI', '$timeout', 'Upload', '$settings', function ($scope, $photoAPI, $timeout, Upload, $settings) {
            $scope.getPhotoUrl = $photoAPI.getPhotoUrl;
            $scope.photos = [];
            $scope.selectedPhoto = undefined;
            $scope.photoUrl = '';
            $scope.photoFilename = '';
            $scope.uploading = false;

            $scope.$watch('selected', function (item) {
                if (item === undefined) {
                    $scope.photos = [];
                } else {
                    $photoAPI.fetchPhotos($scope.selected.trackId, function (list) {
                        $scope.photos = list;
                    });
                }
            });

            $scope.clickImage = function(photo) {
                $scope.selectedPhoto = photo;
                $scope.photoUrl = $scope.getPhotoUrl(photo._id);
                $scope.photoFilename = photo.filename;
            };

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });
            $scope.$watch('file', function () {
                if ($scope.file !== null) {
                    $scope.files = [$scope.file];
                }
            });

            $scope.deleteSelectedPhoto = function() {
                if($scope.selectedPhoto === undefined)
                    return;
                $photoAPI.deletePhoto( $scope.selectedPhoto._id, function() {
                    $photoAPI.fetchPhotos($scope.selected.trackId, function (list) {
                        $scope.photos = list;
                    });
                });
            };

            $scope.log = '';
            $scope.upload = function (files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        if(!file)
                            continue;
                        if (!file.$error) {
                            $scope.uploading = true;
                            $scope.percentComplete = 0;
                            Upload.upload({
                                url: $photoAPI.getPhotoPostUrl($scope.selected.trackId),
                                data: {
                                    recfile: file
                                }
                            }).then(function (resp) {
                                $timeout(function () {
                                    $scope.percentComplete = 100;
                                    $scope.uploading = false;
                                    
                                    $scope.log = 'file: ' +
                                            resp.config.data.recfile.name +
                                            ', Response: ' + JSON.stringify(resp.data) +
                                            '\n' + $scope.log;
                                });
                            }, null, function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.percentComplete = progressPercentage;
                                
                                $scope.log = 'progress: ' + progressPercentage +
                                        '% ' + evt.config.data.recfile.name + '\n' +
                                        $scope.log;
                            });
                        }
                    }
                }
            };


        }]);

}());

