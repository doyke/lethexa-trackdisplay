(function () {
    var wsAPI = angular.module('wsAPI', [
        'settings',
        'ngWebSocket'
    ]);

    wsAPI.factory('$wsAPI', ['$websocket', '$settings', function ($websocket, $settings) {
            var listenerMap = {};
            var trackStream;

            var notifyListenersFor = function (msgType, msg) {
                var foundList = listenerMap[msgType];
                if (foundList !== undefined) {
                    foundList.forEach(function (callback) {
                        callback(msg);
                    });
                }
            };

            var connect = function () {
                trackStream = $websocket($settings.getTrackStreamUrl(), 'echo-protocol');

                trackStream.onOpen(function () {
                    console.log('Websocket opened');
                    notifyListenersFor('ws-connected');
                });

                trackStream.onMessage(function (message) {
                    var msg = JSON.parse(message.data);
                    if(msg.header && msg.header.type && msg.data) {
                        notifyListenersFor(msg.header.type, msg.data);
                    }
                });

                trackStream.onClose(function () {
                    console.log('Websocket closed');
                    notifyListenersFor('ws-disconnected');
                    trackStream = null;
                    setTimeout(function () {
                        connect();
                    }, 1000);
                });
            };

            connect();

            return {
                addListenerFor: function (msgType, callback) {
                    var foundList = listenerMap[msgType];
                    if (foundList === undefined) {
                        foundList = [];
                        listenerMap[msgType] = foundList;
                    }
                    foundList.push(callback);
                },

                removeListenerFor: function (msgType, callback) {
                    var foundList = listenerMap[msgType];
                    if (foundList !== undefined) {
                        var index = foundList.indexOf(callback);
                        foundList.splice(index, 1);
                        if (foundList.length === 0) {
                            listenerMap[msgType] = undefined;
                        }
                    }
                },
                
                send: function(type, data) {
                    if(trackStream) {
                        trackStream.send(JSON.stringify({
                            header: {
                                type: type 
                            },
                            data: data
                        }));
                    }
                }
            };
        }]);

}());
