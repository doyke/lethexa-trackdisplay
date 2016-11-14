(function() {

  var app = angular.module('trackDisplay', [
    'trackAPI',
    'trackMap',
    'trackList',
    'trackInfo',
    'trackFilter',
    'trackMessage',
    'trackSearch',
    'waitDialog'
  ]);

  app.directive('trackDisplay', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'track-display/track-display.html',
      controller: 'TrackDisplayCtrl'
    };
  });

  app.controller('TrackDisplayCtrl', ['$scope', '$trackAPI', function($scope, $trackAPI) {

    $trackAPI.addListenerFor('ws-connected', function() {        
        $scope.$apply(function() {
            $scope.waitVisible = false;
        });
    });

    $trackAPI.addListenerFor('ws-disconnected', function() {
        $scope.$apply(function() {
            $scope.waitVisible = true;
        });
    });

    $scope.tabName = "tab1";
  }]);

}());

