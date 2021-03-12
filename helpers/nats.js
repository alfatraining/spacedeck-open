'use strict';

const NATS = require('nats');
const _ = require('underscore');

module.exports = {
  connectNats: function () {
    if (process.env.NODE_ENV === 'development') {
      this.connection = NATS.connect({
        url: process.env.SPACEDECK_NATS_ADDR,
        user: process.env.SPACEDECK_NATS_AUTHENTICATION_USERNAME,
        pass: process.env.SPACEDECK_NATS_AUTHENTICATION_PASSWORD,
      });
    } else {
      this.connection = NATS.connect({
        url: process.env.SPACEDECK_NATS_ADDR,
        user: process.env.SPACEDECK_NATS_AUTHENTICATION_USERNAME,
        pass: process.env.SPACEDECK_NATS_AUTHENTICATION_PASSWORD,
        tls: {
          key: process.env.SPACEDECK_NATS_AUTHENTICATION_KEY,
          cert: process.env.SPACEDECK_NATS_AUTHENTICATION_CERT,
          ca: process.env.SPACEDECK_NATS_AUTHENTICATION_CA,
        },
      });
    }
  },
  getConnection: function () {
    return this.connection;
  },
  sendMessage: function (action, model, attributes, channelId) {
    const spaceId = model === 'Artifact' ? attributes.space_id : attributes._id;
    const stringifiedObject = JSON.stringify(attributes);
    const msgSize = Buffer.byteLength(stringifiedObject, 'utf8');
    const maxMsgSize = _.get(this.connection, 'info.max_payload', 2048);

    if (msgSize > maxMsgSize) {
      attributes = { _id: attributes._id };
    }

    const data = JSON.stringify({
      space_id: spaceId,
      channel_id: channelId,
      action: action,
      model: model,
      object: attributes,
    });

    this.connection.publish(`_spacedeck.updates.${spaceId}`, data);
  },
};
