const mongoose = require('mongoose');

const studentRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequestType', 
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  

  description: String,
  documents: [{
    documentName: String,
    documentURL: String
  }],
  department: String,
  status: {
    type: String,
    enum: ["ממתין", "בטיפול", "אושר", "נדחה"],
    default: "ממתין"
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  staffComments: [{
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('StudentRequest', studentRequestSchema);
