const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const connectionSchema = new Schema({
    ConnectionId: Number,
    SourceId : Number,
    DestinationId: Number,
    Frequency: String,
    LastSync: String,
    IsEnabled: Boolean
});

module.exports = mongoose.model('Connection',connectionSchema)