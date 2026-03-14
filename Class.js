const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay;

// Lazily initialize Razorpay instance when needed
function getRazorpayInstance() {
  if (!razorpay) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error('Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.');
    }
    razorpay = new Razorpay({ key_id, key_secret });
  }
  return razorpay;
}

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount, classId, className } = req.body;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise (multiply by 100)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        classId,
        className,
        userId: req.user._id.toString(),
      },
    };

    const order = await getRazorpayInstance().orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      classId,
    } = req.body;

    // Verify signature
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay key secret missing in environment.');
      return res.status(500).json({
        success: false,
        message: 'Server misconfiguration: missing Razorpay key secret.',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified, now enroll the user
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await getRazorpayInstance().payments.fetch(req.params.paymentId);

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
    });
  }
};
