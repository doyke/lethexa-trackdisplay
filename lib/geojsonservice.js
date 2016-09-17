 
module.exports.registerService = function(app, trackPicture) {

  var cvtTracksToGeoJson = function() {
    var msg = {
      type: 'FeatureCollection',
      features: []
    };

    trackPicture.provideTracksOn(function(track) {
      msg.features.push({
	type: 'Feature',
	id: track.trackId,
	geometry: {
	  type: 'Point',
	  coordinates: [track.lon, track.lat]
	},
	properties: {
	  mmsi: track.trackId,
	  name: track.name
	}
      });
    });
    return msg;
  };

  app.get('/aispicture.geojson', function(req, res) {
    var geojson = cvtTracksToGeoJson();
    res.json(geojson);    
  });  

};