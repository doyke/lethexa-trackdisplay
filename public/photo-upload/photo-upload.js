/* global units */

(function () {

    var photoUpload = angular.module('photoUpload', [
        'toggleBtn',
        'ngFileUpload'
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

    photoUpload.controller('PhotoUploadCtrl', ['$scope', 'Upload', '$timeout', '$photoAPI', '$settings', function ($scope, Upload, $timeout, $photoAPI, $settings) {
            $scope.uploading = false;

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });
            $scope.$watch('file', function () {
                if ($scope.file !== null) {
                    $scope.files = [$scope.file];
                }
            });
            $scope.log = '';

            $scope.upload = function (files) {
                var uploadUrl = $settings.getStorageServerUrl() + '/photos/' + $scope.selected.trackId;
                
                console.log('Uploading to', uploadUrl);
                
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        if(!file)
                            continue;
                        if (!file.$error) {
                            $scope.uploading = true;
                            $scope.percentComplete = 0;
                            Upload.upload({
                                url: uploadUrl,
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

