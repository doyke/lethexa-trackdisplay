 
module.exports.registerService = function(app, trackPicture) {
  console.log('register GeoJson-service');
  

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

  app.get('/trackpicture.geojson', function(req, res) {
    var geojson = cvtTracksToGeoJson();
    res.json(geojson);    
  });  

};