(function() {
  var trackAPI = angular.module('trackAPI', [
    'ngWebSocket'
  ]);

  trackAPI.factory('$trackAPI', ['$websocket', function($websocket) {
    var trackStream = $websocket('ws://' + window.location.host + '/', 'tracks');

    return {
      registerForTracks: function(callback) {
        trackStream.onMessage(function(message) {
          callback(JSON.parse(message.data));
        });
      }
    };
  }]);

}());
