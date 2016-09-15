(function() {

  var trackMap = angular.module('trackMap', [
    'trackAPI'
  ]);

  trackMap.directive('trackMap', function() {
    return {
      require: 'E',
      replace: true,
      controller: 'TrackMapCtrl',
      templateUrl: 'trackmap/trackmap.html',
      scope: {
        selected: "="
      }
    };
  })

  trackMap.controller('TrackMapCtrl', ['$scope', '$trackAPI', function($scope, $trackAPI) {
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var map = L.map('map').setView([53.5, 8.125], 10);
    L.tileLayer(osmUrl, {
      minZoom: 3
    }).addTo(map);

    var trackPicture = {};
    var trackLayer = L.trackLayer();
    trackLayer.addTo(map);
   
    var fixString = function(value) {
      return value.replace(/@/gi, '');
    };
 
    var createPopupContent = function(track) {
      var result = '';
      result += '<table>';
      result += '<tr><td>TrackId:</td><td>' + track.trackId + '</td></tr>';
      result += '</table>'
      return result;
    };

    var updateSelectedTrackBy = function(track) {
      return {    
        trackId: track.trackId,
        time: units.ABSTIME.asString(track.time),
        speed: units.SPEED.asString(track.speed),
        course: units.DIRECTION.asString(track.course),
        heading: units.DIRECTION.asString(track.heading),
        lat: units.LATITUDE.asString(track.lat),
        lon: units.LONGITUDE.asString(track.lon),
        name: track.name,
        callsign: track.callsign,
        dest: track.dest,
        country: track.country,
        objlength: track.objlength,
        objbeam: track.objbeam
      };
    }; 

    $trackAPI.registerForTracks( function(track) {

      if(trackPicture[track.trackId] === undefined) {

        if(!track.lat) 
          return;
        if(!track.lon) 
          return;

        var trackMarker = L.trackSymbol(L.latLng(track.lat, track.lon), {
          trackId: track.trackId,
          fill: true,
          fillColor: '#0000ff',
          fillOpacity: 1.0,
          stroke: true,
          color: '#000000',
          opacity: 1.0,
          weight: 1.0,
          gpsRefPos: track.gpsRefPos,
          speed: track.speed === null ? undefined : track.speed,
          course: track.course === null ? undefined : track.course,
          heading: track.heading === null ? undefined : track.heading
        });
        trackMarker.on('click', function(event) {
          var marker = event.target;
          //console.log('marker', marker);
          //console.log('scope: ', $scope);
          $scope.$apply(function () {
            $scope.selected = updateSelectedTrackBy(track);
          });
        });

        // trackMarker.bindPopup('');
        // trackMarker.on('popupopen', function() {
        //   trackMarker._popup.setContent(createPopupContent(track));
        // });
        trackPicture[track.trackId] = trackMarker;
        trackLayer.addTrack(trackMarker);
      }
      else {
        var trackMarker = trackPicture[track.trackId];

        if(track.lat && track.lon) {
          trackMarker.setLatLng( L.latLng(track.lat, track.lon) );
        }

        trackMarker.setSpeed(track.speed);
        trackMarker.setCourse(track.course);
        trackMarker.setHeading(track.heading);
        trackMarker.setGPSRefPos(track.gpsRefPos);

        if($scope.selected === undefined)
          return;

        if($scope.selected.trackId === track.trackId ) {
          $scope.selected = updateSelectedTrackBy(track);
        }

      }
    });

  }]);

}());

