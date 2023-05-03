const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const destinationSchema = new Schema({
  DestinationId: Number,
  DestinationType: String,
  SheetId: String,
  SheetName: String,
  Host: String,
  Port: String,
  DBName: String,
  User: String,
  Pass: String,
  DatasetId: Number,
  ProjectId: String,
  TableId: String,
  key: String
});

module.exports = mongoose.model('Destination',destinationSchema)
