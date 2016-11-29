(function () {
    var photoAPI = angular.module('photoAPI', [
        'settings'
    ]);

    photoAPI.factory('$photoAPI', ['$http', '$settings', function ($http, $settings) {

            return {
                getPhotoUrl: function (photoId) {
                    return $settings.getStorageServerUrl() + '/photos/' + photoId;
                },

                fetchPhotos: function (trackId, callback) {
                    $http.get($settings.getStorageServerUrl() + '/photos/track/' + trackId).then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                },
                
                deletePhoto: function (photoId, callback) {
                    $http.delete($settings.getStorageServerUrl() + '/photos/' + photoId).then(
                            function successCallback(response) {
                                callback(response.data);
                            },
                            function errorCallback(response) {
                            }
                    );
                }
            };
        }]);

}());
