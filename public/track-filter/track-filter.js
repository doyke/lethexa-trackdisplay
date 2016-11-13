/* global units */

(function() {

  var trackFilter = angular.module('trackFilter', [
  ]);

  trackFilter.directive('trackFilter', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        trackFilter: '='
      },
      templateUrl: 'track-filter/track-filter.html',
      controller: 'TrackFilterCtrl'
    };
  });

  trackFilter.controller('TrackFilterCtrl', ['$scope', function($scope) {

  }]);

}());

