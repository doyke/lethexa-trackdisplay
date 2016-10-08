(function() {

  var trackInfo = angular.module('trackList', [
  ]);

  trackInfo.directive('trackList', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selected: '='
      },
      templateUrl: 'tracklist/tracklist.html',
      controller: 'TrackListCtrl'
    };
  });

  trackInfo.controller('TrackListCtrl', ['$scope', function($scope) {

  }]);

}());

