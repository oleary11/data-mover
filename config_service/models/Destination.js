const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const destinationSchema = new Schema({
  DestinationId: Number,
  DestinationType: String,
  Host: String,
  Post: String,
  DBName: String,
  User: String,
  Pass: String
});

module.exports = mongoose.model('Destination',destinationSchema)