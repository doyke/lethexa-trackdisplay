(function() {

  var trackInfo = angular.module('trackMessage', [
    'trackAPI'
  ]);

  trackInfo.directive('trackMessage', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'track-message/track-message.html',
      controller: 'TrackMessageCtrl'
    };
  });

  trackInfo.controller('TrackMessageCtrl', function($scope, $trackAPI) {
    $trackAPI.addListenerFor('msg', function(msg) {
      console.log(msg);
    });
    
  });

}());

