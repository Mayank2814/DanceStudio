const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  attendance: [{
    date: {
      type: Date
    },
    present: {
      type: Boolean,
      default: false
    }
  }]
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ user: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
