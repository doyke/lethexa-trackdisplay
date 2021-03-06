var events = require('events');
var util = require('util');
var amqp = require('amqplib/callback_api');


module.exports.MsgQueue = function (pubname, options) {
    events.EventEmitter.call(this);
    options = options || {};
    options.exchange = options.exchange || 'simulator';
    options.topics = options.topics || [];
    var self = this;
    var channel, connection;

    var createMsg = function (type, data) {
        var msg = {
            header: {
                type: type
            },
            data: data
        };
        return msg;
    };

    this.initialize = function () {
        amqp.connect('amqp://localhost', function (err, conn) {
            if (err) {
                self.emit('error', err);
                return;
            }
            connection = conn;

            connection.createChannel(function (err, ch) {
                if (err) {
                    self.emit('error', err);
                    return;
                }
                channel = ch;

                channel.assertExchange(options.exchange, 'topic', {durable: false});
                channel.assertQueue(pubname, {exclusive: true}, function (err, q) {
                    if (err) {
                        self.emit('error', err);
                        return;
                    }

                    options.topics.forEach(function (topic) {
                        console.log('Binding topic:', topic, 'on exchange', options.exchange);
                        channel.bindQueue(q.queue, options.exchange, topic);
                    });

                    console.log('MQ:Waiting for messages...');
                    channel.consume(q.queue, function (msg) {
                        self.emit('data', msg.fields.routingKey, msg.content.toString());
                        //console.log(msg.fields.routingKey, msg.content.toString());
                    }, {noAck: true});

                    self.emit('initialized');
                });

            });
        });
    };

    this.publish = function (routingKey, type, message) {
        if (!channel)
            return;
        var msg = createMsg(type, message);
        channel.publish(options.exchange, routingKey, new Buffer(msg));
    };

    this.publishRaw = function (routingKey, message) {
        if (!channel)
            return;
        channel.publish(options.exchange, routingKey, new Buffer(message));
    };

    this.shutdown = function () {
        if (channel) {
            channel.close();
            channel = undefined;
        }
        if (connection) {
            connection.close();
            connection = undefined;
        }
        self.emit('shutdown');
        console.log('MQ:shutdown...');
    };
};

util.inherits(module.exports.MsgQueue, events.EventEmitter);

