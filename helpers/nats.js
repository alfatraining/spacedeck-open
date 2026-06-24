'use strict';

const { connect, StringCodec } = require('nats');
const get = require('lodash/get');

const sc = StringCodec();

module.exports = {
  connectNats: async function () {
    const opts = {
      servers: process.env.SPACEDECK_NATS_ADDR,
      user: process.env.SPACEDECK_NATS_AUTHENTICATION_USERNAME,
      pass: process.env.SPACEDECK_NATS_AUTHENTICATION_PASSWORD,
    };

    if (process.env.NODE_ENV !== 'development') {
      opts.tls = {
        key: process.env.SPACEDECK_NATS_AUTHENTICATION_KEY,
        cert: process.env.SPACEDECK_NATS_AUTHENTICATION_CERT,
        ca: process.env.SPACEDECK_NATS_AUTHENTICATION_CA,
      };
    }

    try {
      this.connection = await connect(opts);
      console.log('NATS connected to', this.connection.getServer());
    } catch (err) {
      console.error('NATS connection error:', err.message);
    }
  },
  getConnection: function () {
    return this.connection;
  },
  sendMessage: function (action, model, attributes, channelId) {
    if (!this.connection) return;

    const spaceId = model === 'Artifact' ? attributes.space_id : attributes._id;
    const stringifiedObject = JSON.stringify(attributes);
    const msgSize = Buffer.byteLength(stringifiedObject, 'utf8');
    const maxMsgSize = get(this.connection, 'info.max_payload', 2048);

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

    this.connection.publish(`_spacedeck.updates.${spaceId}`, sc.encode(data));
  },
};
