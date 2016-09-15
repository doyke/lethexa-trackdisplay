(function() {

  var app = angular.module('trackDisplay', [
    'trackMap',
    'trackList',
    'trackInfo'
  ]);

  app.directive('trackDisplay', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'trackdisplay/trackdisplay.html',
      controller: 'TrackDisplayCtrl'
    };
  });

  app.controller('TrackDisplayCtrl', function($scope) {
  });

}());

