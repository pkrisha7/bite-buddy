const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order + Razorpay payment order
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        const order = await Order.create({
            user: req.user.id,
            restaurant: restaurantId,
            items,
            totalAmount,
            deliveryAddress,
            razorpayOrderId: razorpayOrder.id,
        });

        res.status(201).json({
            order,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Verify payment after Razorpay success
router.post('/verify', authMiddleware, async(req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const order = await Order.findByIdAndUpdate(orderId, {
            isPaid: true,
            razorpayPaymentId,
            status: 'confirmed',
        }, { new: true });

        res.json({ message: 'Payment verified', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get user's orders
router.get('/myorders', authMiddleware, async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;