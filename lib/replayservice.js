
module.exports.registerService = function (app, mq, wsService) {
    console.log('register Replayservice');
    var prefix = 'sim.replay.*';
    
    var isLineExisting = function(line) {
        if(line === undefined)
            return false;
        if(line === null)
            return false;
        if(line.length <= 0)
            return false;
	return true;
    };
    
    var trimLine = function( line ) {
        if(!isLineExisting(line))
	    return '';
        return line.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '');
    };

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