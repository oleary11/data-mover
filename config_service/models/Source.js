const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const sourceSchema = new Schema({
  SourceId: Number,
  SourceType: String,
  SheetId: String,
  SheetName: String
});

module.exports = mongoose.model('Source',sourceSchema)