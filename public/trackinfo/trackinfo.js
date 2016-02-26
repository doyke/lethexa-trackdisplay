(function() {

  var trackInfo = angular.module('trackInfo', []);

  trackInfo.directive('trackInfo', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selected: '='
      },
      templateUrl: 'trackinfo/trackinfo.html',
      controller: 'TrackInfoCtrl'
    };
  });

  trackInfo.controller('TrackInfoCtrl', function($scope) {
    $scope.selected = undefined;
  });

}());

