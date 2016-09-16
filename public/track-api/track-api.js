(function() {
  var trackAPI = angular.module('trackAPI', [
    'ngWebSocket'
  ]);

  trackAPI.factory('$trackAPI', ['$websocket', function($websocket) {
    var trackStream = $websocket('ws://' + window.location.host + '/', 'tracks');
    var listenerMap = {};

    var notifyListenersFor = function(msgType, msg) {
      var foundList = listenerMap[msgType];
      if(foundList !== undefined) {
        foundList.forEach(function(callback) {
          callback(msg);
	});
      }
    };

    trackStream.onMessage(function(message) {
      var msg = JSON.parse(message.data);
      notifyListenersFor(msg.header.type, msg);
    });

    return {
      addListenerFor: function(msgType, callback) {
	var foundList = listenerMap[msgType];
	if(foundList === undefined) {
	  foundList = [];
	  listenerMap[msgType] = foundList;
	}
	foundList.push(callback);
      },

      removeListenerFor: function(msgType, callback) {
	var foundList = listenerMap[msgType];
	if(foundList !== undefined) {
	  var index = foundList.indexOf(callback);
	  foundList.splice(index, 1);
	  if(foundList.length === 0) {
	    listenerMap[msgType] = undefined;
	  }
	}
      }
      
    };
  }]);

}());
