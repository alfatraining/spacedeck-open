'use strict';

const config = require('config');
const NATS = require('nats');

module.exports = {
    connectNats: function() {
      if (config.get("redis_mock")) {
        this.connection = notRedis;
      } else {
        this.connection = NATS.connect('nats')
      }
    },
    getConnection: function() {
      this.connectNats();
      return this.connection;
    },
    sendMessage: function(action, model, attributes, channelId) {
      const data = JSON.stringify({
        channel_id: channelId,
        action: action,
        model: model,
        object: attributes
      });
      this.connection.publish('updates', data);
    },
  };
  
  return module.exports;
  
