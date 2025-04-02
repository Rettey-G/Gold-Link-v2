const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Sales Schema
const SaleSchema = new mongoose.Schema({
    date: Date,
    invoice_no: String,
    company: String,
    gross_amount: Number,
    packing_transport: Number,
    air_freight: Number,
    total: Number,
    no_of_box: Number,
    gross_weight: Number,
    net_weight: Number,
    payment_status: {
        type: String,
        enum: ['PAID', 'Pending'],
        default: 'Pending'
    },
    amount_paid: Number
});

const Sale = mongoose.model('Sale', SaleSchema);

// Resort Schema
const ResortSchema = new mongoose.Schema({
    name: String,
    company: String,
    address: String,
    contact: String,
    contactPerson: String,
    email: String,
    regNo: String,
    gstNo: String
});

const Resort = mongoose.model('Resort', ResortSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    unit: String,
    category: String
});

const Product = mongoose.model('Product', ProductSchema);

// Quotation Schema
const QuotationSchema = new mongoose.Schema({
    number: String,
    date: Date,
    resort: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resort'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        price: Number
    }],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
        default: 'Draft'
    },
    notes: String
});

const Quotation = mongoose.model('Quotation', QuotationSchema);

// Test route
router.get('/test-db', (req, res) => {
    res.json({ message: 'Database connection is working!' });
});

// Sales routes
router.get('/sales', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Error fetching sales data' });
    }
});

router.post('/sales', async (req, res) => {
    try {
        const sale = new Sale(req.body);
        await sale.save();
        res.status(201).json(sale);
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/sales/:id', async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(sale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/sales/:id', async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(400).json({ message: error.message });
    }
});

// Resort routes
router.get('/resorts', async (req, res) => {
    try {
        const resorts = await Resort.find();
        res.json(resorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/resorts', async (req, res) => {
    try {
        const resort = new Resort(req.body);
        await resort.save();
        res.status(201).json(resort);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Product routes
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Quotation routes
router.get('/quotations', async (req, res) => {
    try {
        const quotations = await Quotation.find()
            .populate('resort')
            .populate('items.product');
        res.json(quotations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/quotations', async (req, res) => {
    try {
        const quotation = new Quotation(req.body);
        await quotation.save();
        res.status(201).json(quotation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/quotations/:id', async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
            .populate('resort')
            .populate('items.product');
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.json(quotation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mount the router
app.use('/.netlify/functions/server', router);

// Export the handler
exports.handler = serverless(app);