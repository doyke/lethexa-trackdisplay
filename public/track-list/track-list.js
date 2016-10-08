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
      templateUrl: 'track-list/track-list.html',
      controller: 'TrackListCtrl'
    };
  });

  trackInfo.controller('TrackListCtrl', ['$scope', function($scope) {

  }]);

}());

