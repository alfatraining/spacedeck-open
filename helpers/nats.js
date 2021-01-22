'use strict';

const NATS = require('nats');

module.exports = {
    connectNats: function() {
      if (process.env.SPACEDECK_ENV === 'development') {
        this.connection = NATS.connect({ url: process.env.SPACEDECK_NATS_ADDR, user: process.env.SPACEDECK_NATS_AUTHENTICATION_USERNAME, pass: process.env.SPACEDECK_NATS_AUTHENTICATION_PASSWORD })
      } else {
        this.connection = NATS.connect({
          url: process.env.SPACEDECK_NATS_ADDR, 
          user: process.env.SPACEDECK_NATS_AUTHENTICATION_USERNAME, 
          pass: process.env.SPACEDECK_NATS_AUTHENTICATION_PASSWORD , 
          tls: { key: process.env.SPACEDECK_NATS_AUTHENTICATION_KEY, cert: process.env.SPACEDECK_NATS_AUTHENTICATION_CERT, ca: process.env.SPACEDECK_NATS_AUTHENTICATION_CA },
        })
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
  
