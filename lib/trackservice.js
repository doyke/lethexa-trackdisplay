 
module.exports.registerService = function(app, trackPicture) {
  console.log('register Trackservice');
  
  app.get('/track/:trackId', function(req, res) {
    var trackId = parseInt(req.params.trackId, 10);
    var track = trackPicture.getTrackById(trackId);
    if(track === undefined)
      res.status(404).send('Track not found !');
    res.json(track);    
  });  
};