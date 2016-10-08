(function() {

  var app = angular.module('trackDisplay', [
    'trackMap',
    'trackList',
    'trackInfo',
    'trackMessage',
    'trackSearch'
  ]);

  app.directive('trackDisplay', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'track-display/track-display.html',
      controller: 'TrackDisplayCtrl'
    };
  });

  app.controller('TrackDisplayCtrl', ['$scope', function($scope) {
    $scope.tabName = "tab1";
  }]);

}());

