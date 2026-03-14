const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

// @route   GET /api/classes/my-enrolled
// @desc    Get current user's enrolled classes
// @access  Private
router.get('/my-enrolled', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledClasses',
      populate: {
        path: 'createdBy',
        select: 'name'
      }
    });

    res.json({
      success: true,
      count: user.enrolledClasses.length,
      data: user.enrolledClasses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrolled classes'
    });
  }
});

// @route   GET /api/classes
// @desc    Get all active dance classes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { danceStyle, level, dayOfWeek } = req.query;
    
    // Build filter
    let filter = { isActive: true };
    
    if (danceStyle) {
      filter.danceStyle = danceStyle;
    }
    
    if (level) {
      filter.level = level;
    }
    
    if (dayOfWeek) {
      filter['schedule.dayOfWeek'] = dayOfWeek;
    }

    const classes = await Class.find(filter)
      .populate('createdBy', 'name')
      .sort('schedule.dayOfWeek schedule.startTime');

    // Normalize classes: include displayPrice (rupees) and capacity fallback
    const normalized = classes.map((c) => {
      const obj = c.toObject();
      obj.displayPrice = obj.price ? (obj.price >= 100 ? Math.round(obj.price / 100) : obj.price) : 0;
      obj.capacity = obj.capacity || obj.maxCapacity || 0;
      return obj;
    });

    res.json({
      success: true,
      count: normalized.length,
      data: normalized
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching classes'
    });
  }
});

// @route   GET /api/classes/:id
// @desc    Get single class details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const danceClass = await Class.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!danceClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Normalize single class response
    const obj = danceClass.toObject();
    obj.displayPrice = obj.price ? (obj.price >= 100 ? Math.round(obj.price / 100) : obj.price) : 0;
    obj.capacity = obj.capacity || obj.maxCapacity || 0;

    res.json({
      success: true,
      data: obj
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching class'
    });
  }
});

// @route   POST /api/classes/:id/enroll
// @desc    Enroll in a dance class
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const danceClass = await Class.findById(req.params.id);

    if (!danceClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!danceClass.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This class is not currently active'
      });
    }

    // Check if class is full
    if (danceClass.enrolledStudents.length >= danceClass.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'This class is full'
      });
    }

    // Check if already enrolled
    if (danceClass.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class'
      });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      user: req.user._id,
      class: danceClass._id
    });

    // Add student to class
    danceClass.enrolledStudents.push(req.user._id);
    await danceClass.save();

    // Add class to user's enrolled classes
    const user = await User.findById(req.user._id);
    user.enrolledClasses.push(danceClass._id);
    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in class',
      data: enrollment
    });
  } catch (error) {
    console.error(error);
    
    // Handle duplicate enrollment error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment'
    });
  }
});

// @route   DELETE /api/classes/:id/unenroll
// @desc    Unenroll from a dance class
// @access  Private
router.delete('/:id/unenroll', protect, async (req, res) => {
  try {
    const danceClass = await Class.findById(req.params.id);

    if (!danceClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if enrolled
    if (!danceClass.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this class'
      });
    }

    // Update enrollment status
    await Enrollment.findOneAndUpdate(
      { user: req.user._id, class: danceClass._id },
      { status: 'cancelled' }
    );

    // Remove student from class
    danceClass.enrolledStudents = danceClass.enrolledStudents.filter(
      studentId => studentId.toString() !== req.user._id.toString()
    );
    await danceClass.save();

    // Remove class from user's enrolled classes
    const user = await User.findById(req.user._id);
    user.enrolledClasses = user.enrolledClasses.filter(
      classId => classId.toString() !== danceClass._id.toString()
    );
    await user.save();

    res.json({
      success: true,
      message: 'Successfully unenrolled from class'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during unenrollment'
    });
  }
});

module.exports = router;
