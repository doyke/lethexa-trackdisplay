
module.exports.registerService = function (app, mq, wsService) {
    console.log('register Replayservice');
    var prefix = 'sim.replay.*';
    
    wsService.on('replay-started', function(settings) {
        var jsonMsg = {
            header: {
                type: 'replay-started'
            },
            data: settings
        };
        mq.publish(prefix, JSON.stringify(jsonMsg));
    });
};