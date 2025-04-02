const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    quotationNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    resort: {
        name: String,
        address: String,
        contact: String,
        email: String
    },
    items: [{
        productId: Number,
        name: String,
        price: Number,
        unit: String,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    tax: Number,
    total: Number,
    notes: String,
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quotation', quotationSchema);