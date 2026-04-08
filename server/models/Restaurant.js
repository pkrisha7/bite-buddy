const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    rating: { type: Number, default: 0 },
    isOpen: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);