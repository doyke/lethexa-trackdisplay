(function() {
  var trackAPI = angular.module('trackAPI', [
    'ngWebSocket'
  ]);

  trackAPI.factory('$trackAPI', ['$websocket', '$http', function($websocket, $http) {
    var listenerMap = {};

    var notifyListenersFor = function(msgType, msg) {
      var foundList = listenerMap[msgType];
      if(foundList !== undefined) {
        foundList.forEach(function(callback) {
          callback(msg);
        });
      }
    };

    var connect = function() {
      var trackStream = $websocket('ws://' + window.location.host + '/', 'tracks');
      
      trackStream.onOpen(function() {
        console.log('Websocket opened');
      });

      trackStream.onMessage(function(message) {
        var msg = JSON.parse(message.data);
        notifyListenersFor(msg.header.type, msg);
      });

      trackStream.onClose(function() {
        console.log('Websocket closed');
        setTimeout(function() {
          connect();
        }, 100);
      });
    };
    
    connect();
       
    
    return {
      fetchTrackFor: function(trackId, callback) {
        $http({
          method: 'GET',
          url: '/track/' + trackId
        }).then(
          function successCallback(response) {
            callback(response.data);
          },
          function errorCallback(response) {
          }
        );
      },

      fetchHistoryPathFor: function(trackId, callback) {
        $http({
          method: 'GET',
          url: '/trackhistory/' + trackId
        }).then(
          function successCallback(response) {
            callback(response.data);
          },
          function errorCallback(response) {
          }
        );
      },
      
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
