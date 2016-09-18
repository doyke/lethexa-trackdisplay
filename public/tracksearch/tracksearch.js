(function() {

  var trackInfo = angular.module('trackSearch', [
    'trackAPI'
  ]);

  trackInfo.directive('trackSearch', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selected: '=',
	mapcenter: '='
      },
      templateUrl: 'tracksearch/tracksearch.html',
      controller: 'TrackSearchCtrl'
    };
  });

  trackInfo.controller('TrackSearchCtrl', function($scope, $trackAPI) {
        
    var trimLine = function( line ) {
      if(line === undefined)
        return '';
      return line.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '');
    };

    $scope.searchAndCenter = function() {
      var idToSearch = trimLine($scope.searchTrackId);
      if(idToSearch === '')
        return;
      $trackAPI.fetchTrackFor(idToSearch, function(track) {
        $scope.mapcenter = track;
        $scope.selected = track;
      });
    };

  });

}());

