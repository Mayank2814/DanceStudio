const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a class title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a class description'],
    trim: true
  },
  instructor: {
    type: String,
    required: [true, 'Please provide an instructor name'],
    trim: true
  },
  danceStyle: {
    type: String,
    required: [true, 'Please provide a dance style'],
    trim: true,
    enum: ['Ballet', 'Hip Hop', 'Contemporary', 'Jazz', 'Salsa', 'Ballroom', 'Breakdance', 'Other']
  },
  level: {
    type: String,
    required: [true, 'Please provide a difficulty level'],
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  // Schedule can be stored as a simple string (e.g. "Tue, Thu - 7:00 PM") or as a structured object
  schedule: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide a schedule']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide class duration in minutes']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Please provide maximum capacity'],
    default: 20
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for checking if class is full
classSchema.virtual('isFull').get(function() {
  return this.enrolledStudents.length >= this.maxCapacity;
});

// Virtual for available spots
classSchema.virtual('availableSpots').get(function() {
  return this.maxCapacity - this.enrolledStudents.length;
});

// Ensure virtuals are included in JSON
classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Class', classSchema);
