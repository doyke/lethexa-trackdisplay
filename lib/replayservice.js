
module.exports.registerService = function (app, mq, wsService) {
    console.log('register Replayservice');
    var prefix = 'sim.replay.ctrl';
    
    wsService.on('replay-started', function(settings) {
        mq.publish(prefix, 'replay-started', settings);
    });
    
    wsService.on('replay-paused', function(settings) {
        mq.publish(prefix, 'replay-paused', settings);
    });
    
    wsService.on('replay-stopped', function(settings) {
        mq.publish(prefix, 'replay-stopped', settings);
    });
};