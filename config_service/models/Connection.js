const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const connectionSchema = new Schema({
    SourceId : Number,
    DestinationId: Number,
    ConnectionType: String,
    Frequency: String,
    LastSync: Date,
    IsEnabled: Boolean
});

module.exports = mongoose.model('Connection',connectionSchema)