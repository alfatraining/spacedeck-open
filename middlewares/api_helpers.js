'use strict';

require('../models/db');
const nats = require('../helpers/nats');

module.exports = (req, res, next) => {
  res.header("Cache-Control", "no-cache");

  req['channelId'] = req.headers['x-spacedeck-channel'];
  req['spacePassword'] = req.headers['x-spacedeck-spacepassword'];
  req['spaceAuth'] = req.query['spaceAuth'] || req.headers['x-spacedeck-space-auth'];

  res['distributeCreate'] = function(model, object) {
    if (!object) return;
    object.artifactHash = `${req.artifactCount}-${new Date(req.space.updatedAt).getTime()}`
    nats.sendMessage("create", model, object, req.channelId);
    this.status(201).json(object);
  };

  res['distributeUpdate'] = function(model, object) {
    if (!object) return;
    object.artifactHash = `${req.artifactCount}-${new Date(req.space.updatedAt).getTime()}`
    nats.sendMessage("update", model, object, req.channelId);
    this.status(200).json(object);
  };

  res['distributeDelete'] = function(model, object) {
    if (!object) return;
    object.artifactHash = `${req.artifactCount}-${new Date(req.space.updatedAt).getTime()}`
    nats.sendMessage("delete", model, object, req.channelId);
    this.sendStatus(204);
  };

  next();
}
