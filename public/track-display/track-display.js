(function() {

  var app = angular.module('trackDisplay', [
    'trackAPI',
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

  app.controller('TrackDisplayCtrl', ['$scope', '$trackAPI', function($scope, $trackAPI) {
    $('#networkProblemDialog').modal({
        backdrop: 'static',
        keyboard: false 
    });

    $trackAPI.addListenerFor('ws-connected', function() {
        $('#networkProblemDialog').modal('hide');
    });

    $trackAPI.addListenerFor('ws-disconnected', function() {
        $('#networkProblemDialog').modal('show');
    });
    
    $scope.tabName = "tab1";
  }]);

}());

