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
        selected: "=",
        mapcenter: "="
      }
    };
  })

  trackMap.controller('TrackMapCtrl', ['$scope', '$trackAPI', function($scope, $trackAPI) {
    var openStreetMapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var openSeaMapmUrl = 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png';
    
    var map = L.map('map').setView([53.5, 8.125], 10);
    L.tileLayer(openStreetMapUrl, {
      minZoom: 3
    }).addTo(map);

    L.tileLayer(openSeaMapmUrl, {
      minZoom: 3
    }).addTo(map);

    var trackPicture = {};
    var trackLayer = L.trackLayer();
    trackLayer.addTo(map);

    var createPopupContent = function(track) {
      var result = '';
      result += '<table>';
      result += '<tr><td>TrackId:</td><td>' + track.trackId + '</td></tr>';
      result += '</table>'
      return result;
    };

    $scope.$watch('mapcenter', function (center) {
      if(center === undefined)
	return;
      map.panTo(new L.LatLng(center.lat, center.lon));
    });

    $scope.$watch('selected', function (track) {
      if(track === undefined)
	return;
      updateHistoryPath(track.trackId);
    });
    
    
    var updateSelectedTrackBy = function(track) {
      var newTrack = {};
      updateParametersFromTo(track, newTrack);
      return newTrack;
      
      /*
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
      };*/
    }; 

    var updateParametersFromTo = function(src, dst) {
      for (var property in src) {
        if (src.hasOwnProperty(property)) {
          dst[property] = src[property];
        }
      }
    };

    
    var historyPath = L.polyline([], {color: 'blue'}).addTo(map);
    
    var updateHistoryPath = function( trackId ) {
      $trackAPI.fetchHistoryPathFor(trackId, function(history) {
        var linePoints = [];
        history.forEach(function(state) {
          linePoints.push(L.latLng(state.lat, state.lon))
        });
        historyPath.setLatLngs(linePoints);
      });
    };
    
    $trackAPI.addListenerFor( 'track', function(track) {

      if(trackPicture[track.trackId] === undefined) {

        if(!track.lat) 
          return;
        if(!track.lon) 
          return;

        var trackMarker = L.trackSymbol(L.latLng(track.lat, track.lon), {
          trackId: track.trackId,
          fill: true,
          fillColor: '#ffffff',
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
        trackMarker.track = track;
        trackMarker.on('click', function(event) {
          var marker = event.target;
          //console.log('marker', marker);
          //console.log('scope: ', $scope);
          $scope.$apply(function () {
            $scope.selected = updateSelectedTrackBy(trackMarker.track);
            //updateHistoryPath($scope.selected.trackId);
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
	trackMarker.track = track;
        trackMarker.setStyle({fillColor: track.color.fill, color: track.color.line});
        trackMarker.setSpeed(track.speed);
        trackMarker.setCourse(track.course);
        trackMarker.setHeading(track.heading);
        trackMarker.setGPSRefPos(track.gpsRefPos);

        if($scope.selected === undefined)
          return;

        if($scope.selected.trackId === track.trackId ) {
          $scope.selected = updateSelectedTrackBy(trackMarker.track);
	  //updateHistoryPath(track.trackId);
        }

      }
    });

  }]);

}());

