(function () {
    var photoAPI = angular.module('photoAPI', [
    ]);

    photoAPI.factory('$photoAPI', ['$http', function ($http) {
            return {
                fetchPhotos: function (trackId, callback) {
                    $http.get('/photos/track/' + trackId).then(
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
