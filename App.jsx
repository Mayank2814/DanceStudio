const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All routes are protected
router.use(protect);

// @route   POST /api/payment/create-order
router.post('/create-order', paymentController.createOrder);

// @route   POST /api/payment/verify
router.post('/verify', paymentController.verifyPayment);

// @route   GET /api/payment/:paymentId
router.get('/:paymentId', paymentController.getPaymentDetails);

module.exports = router;
