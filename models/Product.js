const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    thaiName: String,
    category: {
        type: String,
        required: true,
        enum: ['mushroom', 'herb', 'spice', 'leafy', 'vegetable', 'fruit']
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    image: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);