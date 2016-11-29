
module.exports.registerService = function (mq, websocket) {
    console.log('register WebSocket <> MessageQueue service');

    mq.on('data', function (routingKey, msg) {
        var jsonMsg = JSON.parse(msg);
        websocket.sendRawMessageToAll(jsonMsg);
    });
};