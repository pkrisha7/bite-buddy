const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'], default: 'placed' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    isPaid: { type: Boolean, default: false },
    deliveryAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);