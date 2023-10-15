const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true },
    expires: { type: Number, required: true },
    userId: { type: String, required: true }
}, { timestamp: true, _id: true, autoIndex: true });
  
  module.exports = mongoose.model('Token', tokenSchema)