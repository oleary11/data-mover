const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const sourceSchema = new Schema({
  SourceId: Number,
  SourceType: String,
  ClientId: String,
  ClientSecret: String,
  RefreshToken: String
});

module.exports = mongoose.model('Source',sourceSchema)