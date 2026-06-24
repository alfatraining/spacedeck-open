'use strict';

// FIXME port this last model

// This model has not been ported from Mongoose to Sequelize yet. The previous
// implementation did `require('mongoose')`, but mongoose is no longer a
// dependency, so requiring this file crashed with "Cannot find module 'mongoose'".
// The original Mongoose schema is preserved below as a reference for whoever
// ports it to a Sequelize model (see models/db.js for the established pattern).
//
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// module.exports.actionSchema = mongoose.Schema({
//   space:       { type: Schema.Types.ObjectId, ref: 'Space' },
//   user:        { type: Schema.Types.ObjectId, ref: 'User' },
//   editor_name: String,
//   action:      String,
//   object:      Schema.Types.Mixed,
//   created_at:  { type: Date, default: Date.now },
//   updated_at:  { type: Date, default: Date.now }
// });
//
// module.exports.actionSchema.index({ space: 1, created_at: 1 });

