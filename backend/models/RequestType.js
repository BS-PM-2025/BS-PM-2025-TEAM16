const mongoose = require('mongoose');

const requestTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('RequestType', requestTypeSchema, 'requestTopics');
