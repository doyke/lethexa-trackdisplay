(function () {
    var settings = angular.module('settings', [
    ]);

    settings.factory('$settings', ['$http', '$window', function ($http, $window) {

            var storageServerUrl = 'http://' + $window.location.hostname + ':8001';
            var terrainServerUrl = 'http://' + $window.location.hostname + ':8002';
            var trackStreamUrl = 'ws://' + $window.location.host + '/';
            
            console.log('storage server', storageServerUrl);
            console.log('terrain server', terrainServerUrl);
            console.log('track stream server', trackStreamUrl);

            return {
                getStorageServerUrl: function() {
                    return storageServerUrl;
                },
                getTerrainServerUrl: function() {
                    return terrainServerUrl;
                },
                getTrackStreamUrl: function() {
                    return trackStreamUrl;
                }
            };
        }]);

}());
