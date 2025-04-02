const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs'); // Add this line
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML pages
app.get('/quotation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'quotation.html'));
});

app.get('/price-list.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'price-list.html'));
});

app.get('/sales.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sales.html'));
});

app.get('/invoice.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.html'));
});

// Import initial product data
const priceListData = require('./price-list-data');

// Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
    id: Number,
    name: String,
    thaiName: String,
    category: String,
    price: Number,
    unit: String,
    image: String
}));

// Quotation Model
const Quotation = mongoose.model('Quotation', new mongoose.Schema({
    quotationNumber: String,
    date: Date,
    resortName: String,
    resortAddress: String,
    resortContact: String,
    resortEmail: String,
    items: [{
        name: String,
        description: String,
        unitPrice: Number,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    tax: Number,
    total: Number,
    notes: String,
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
        default: 'Draft'
    }
}, { timestamps: true }));

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

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    invoice_no: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    company: { type: String, required: true },
    address: String,
    contact: String,
    email: String,
    shipping_address: String,
    shipping_method: String,
    shipping_terms: String,
    items: [{
        description: String,
        quantity: Number,
        unit: String,
        unit_price: Number
    }],
    packing_transport: Number,
    air_freight: Number,
    notes: String,
    terms: String,
    payment_status: { type: String, enum: ['Pending', 'PAID'], default: 'Pending' }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Resort data
const resortData = [
    {
        name: "Movenpick Resorts Kuredhivaru Maldives",
        company: "Kuredu Holding Pvt Ltd",
        building: "H.Dhooriha, 5th Floor (5B)",
        road: "Kalaafaanu Higun",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "20076",
        contact: "+960 944253",
        contact_person: "Mr. Muruganandam",
        email: "",
        reg_no: "C-0510/2013",
        gst_no: ""
    },
    {
        name: "Furaveri Island Resort & Spa",
        company: "Urban Organics",
        building: "C/O: NAID Investments, 3rd Floor",
        road: "M. Newton, Dhanbu Goalhi",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "",
        contact: "+960 7785384",
        contact_person: "Mr. Mohamed Abdulla, Mr. Malith Rathnayake",
        email: "purchasing.officer@furaveri.com",
        reg_no: "",
        gst_no: "1003226GST001"
    },
    {
        name: "MabinHura by JAWAKARA Islands Maldives",
        company: "Leisure Oceans Pvt Ltd",
        building: "Champa Building, 4th Floor",
        road: "Kandi Dhon Manik Goalhi",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "20187",
        contact: "",
        contact_person: "Mr. Rajeevan",
        email: "pm@jawakara.com",
        reg_no: "BN46082023",
        gst_no: ""
    },
    {
        name: "Kanuhura Maldives",
        company: "CDL HBT Oceanic Maldives Pvt Ltd",
        building: "H.Jazeera Building, 2nd Floor",
        road: "Boduthakurufaanu Magu",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "",
        contact: "",
        contact_person: "Mr. Ali Shareef, Mr. Ahmed Easa",
        email: "shareef.ali@sixsenses.com, ahmed.easa@sixsenses.com",
        reg_no: "C-03032021",
        gst_no: "1128496GST001"
    },
    {
        name: "Raffles Maldives Meradhoo Resort",
        company: "Dragonfly Holdings Pvt Ltd",
        building: "H. Fusthulhaamaage, 8th Floor",
        road: "Ameeru Ahmed Magu",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "20030",
        contact: "+960 6581111, +960 7996042",
        contact_person: "Mr. Palinda Gangadara",
        email: "palinda.gangadara@raffles.com",
        reg_no: "C-0169/2014",
        gst_no: "1025311GST001"
    },
    {
        name: "Canareef Resort",
        company: "Canareef Resort Pvt Ltd",
        building: "Eastern Lagoon",
        road: "Dhilkushaa Goalhi",
        area: "",
        city: "Malé",
        country: "Maldives",
        pincode: "20193",
        contact: "+960 6896677, +960 7946412",
        contact_person: "Mr. Thowthis Ali",
        email: "procurement@canareef.com",
        reg_no: "C-0169/2014",
        gst_no: "1047168GST001"
    },
    {
        name: "Zen Resort",
        company: "Zen Resort Pvt Ltd",
        building: "",
        road: "Raa Atoll",
        area: "",
        city: "Raa Atoll",
        country: "Maldives",
        pincode: "",
        contact: "",
        contact_person: "Ms. Aminath Moosa",
        email: "ami@ctnt.com",
        reg_no: "C-0283/202",
        gst_no: ""
    }
];

// Resort Schema
const ResortSchema = new mongoose.Schema({
    name: String,
    company: String,
    building: String,
    road: String,
    area: String,
    city: String,
    country: String,
    pincode: String,
    contact: String,
    contact_person: String,
    email: String,
    reg_no: String,
    gst_no: String
});

const Resort = mongoose.model('Resort', ResortSchema);

// Initial sales data
const salesData = [
    {
        date: new Date('2024-03-30'),
        invoice_no: 'GL202404-057',
        company: 'RAFFLES MALDIVES MERADHOO RESORT',
        gross_amount: 1550.41,
        packing_transport: 165,
        air_freight: 653.3,
        total: 2368.71,
        no_of_box: 28,
        gross_weight: 278,
        net_weight: 244,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-31'),
        invoice_no: 'GL202404-059',
        company: 'MAABINHURA MALDIVES',
        gross_amount: 4601.15,
        packing_transport: 130,
        air_freight: 2619.00,
        total: 7350.15,
        no_of_box: 82,
        gross_weight: 1154.00,
        net_weight: 1020.00,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-27'),
        invoice_no: 'GL202404-056',
        company: 'KANUHURA MALDIVES',
        gross_amount: 7161.43,
        packing_transport: 473,
        air_freight: 4808.25,
        total: 12442.68,
        no_of_box: 201,
        gross_weight: 2137.00,
        net_weight: 1824.50,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-29'),
        invoice_no: 'GL202404-058',
        company: 'MOVENPICK RESORTS KUREDHIVARU MALDIVES',
        gross_amount: 1473.93,
        packing_transport: 157.5,
        air_freight: 813.4,
        total: 2444.83,
        no_of_box: 25,
        gross_weight: 332,
        net_weight: 295,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-26'),
        invoice_no: 'GL202404-055',
        company: 'I.V.P.L INVESTMENTS VENTURES PVT LTD (COMO MAALIFUSHI)',
        gross_amount: 3372.45,
        packing_transport: 265,
        air_freight: 1766.40,
        total: 5403.85,
        no_of_box: 69,
        gross_weight: 812,
        net_weight: 730,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-24'),
        invoice_no: 'GL202404-054',
        company: 'MAABINHURA MALDIVES',
        gross_amount: 3236.65,
        packing_transport: 130,
        air_freight: 1936.60,
        total: 5303.25,
        no_of_box: 82,
        gross_weight: 842,
        net_weight: 779,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-20'),
        invoice_no: 'GL202404-053',
        company: 'FURAVERI ISLAND RESORT & SPA',
        gross_amount: 1065.40,
        packing_transport: 120,
        air_freight: 751.95,
        total: 1937.35,
        no_of_box: 32,
        gross_weight: 337,
        net_weight: 269,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-20'),
        invoice_no: 'GL202404-052',
        company: 'MOVENPICK RESORTS KUREDHIVARU MALDIVES',
        gross_amount: 2343.14,
        packing_transport: 198,
        air_freight: 931,
        total: 3472.14,
        no_of_box: 30,
        gross_weight: 380,
        net_weight: 299,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-17'),
        invoice_no: 'GL202404-051',
        company: 'MAABINHURA MALDIVES',
        gross_amount: 4137.65,
        packing_transport: 330,
        air_freight: 2389.20,
        total: 6856.85,
        no_of_box: 110,
        gross_weight: 1046.00,
        net_weight: 939,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-14'),
        invoice_no: 'GL202404-050',
        company: 'RAFFLES MALDIVES MERADHOO RESORT',
        gross_amount: 1126.06,
        packing_transport: 145,
        air_freight: 512.3,
        total: 1783.36,
        no_of_box: 20,
        gross_weight: 218,
        net_weight: 193,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-07'),
        invoice_no: 'GL202404-047',
        company: 'CANAREEF RESORT PVT LTD',
        gross_amount: 782.78,
        packing_transport: 120,
        air_freight: 721.65,
        total: 1624.43,
        no_of_box: 21,
        gross_weight: 283,
        net_weight: 246.5,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-07'),
        invoice_no: 'GL202404-048',
        company: 'MAABINHURA MALDIVES',
        gross_amount: 3702.55,
        packing_transport: 130,
        air_freight: 2072.30,
        total: 5904.85,
        no_of_box: 85,
        gross_weight: 901,
        net_weight: 784,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-07'),
        invoice_no: 'GL202404-045',
        company: 'MOVENPICK RESORTS KUREDHIVARU MALDIVES',
        gross_amount: 1315.84,
        packing_transport: 152.5,
        air_freight: 708.05,
        total: 2176.39,
        no_of_box: 23,
        gross_weight: 289,
        net_weight: 255.2,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-05'),
        invoice_no: 'GL202404-046',
        company: 'FURAVERI ISLAND RESORT & SPA',
        gross_amount: 1072.50,
        packing_transport: 120,
        air_freight: 524.05,
        total: 1716.55,
        no_of_box: 23,
        gross_weight: 223,
        net_weight: 191,
        payment_status: 'Pending'
    },
    {
        date: new Date('2024-03-07'),
        invoice_no: 'GL202404-044',
        company: 'MAABINHURA MALDIVES',
        gross_amount: 2629.45,
        packing_transport: 130,
        air_freight: 1833.00,
        total: 4592.45,
        no_of_box: 63,
        gross_weight: 710,
        net_weight: 614,
        payment_status: 'Pending'
    }
];

// Initialize sales data if none exists
async function initializeSalesData() {
    try {
        // Clear existing sales first
        await Sale.deleteMany({});
        
        const allSalesData = [
            // March 2024 (most recent first)
            ...salesData,
            // February 2024
            {
                date: new Date('2024-02-26'),
                invoice_no: 'GL202403-041',
                company: 'MAABINHURA MALDIVES',
                gross_amount: 2462.85,
                packing_transport: 130,
                air_freight: 1573.20,
                total: 4166.05,
                no_of_box: 63,
                gross_weight: 684,
                net_weight: 569,
                payment_status: 'Pending'
            },
            {
                date: new Date('2024-02-21'),
                invoice_no: 'GL202403-040',
                company: 'I.V.P.L INVESTMENTS VENTURES PVT LTD (COMO MAALIFUSHI)',
                gross_amount: 2681.73,
                packing_transport: 267.5,
                air_freight: 1765.60,
                total: 4714.83,
                no_of_box: 69,
                gross_weight: 808,
                net_weight: 635.52,
                payment_status: 'Pending'
            },
            {
                date: new Date('2024-02-19'),
                invoice_no: 'GL202403-039',
                company: 'MAABINHURA MALDIVES',
                gross_amount: 1312.20,
                packing_transport: 130,
                air_freight: 885.5,
                total: 2327.70,
                no_of_box: 35,
                gross_weight: 385,
                net_weight: 327,
                payment_status: 'Pending'
            },
            {
                date: new Date('2024-02-19'),
                invoice_no: 'GL202403-038',
                company: 'FURAVERI ISLAND RESORT & SPA',
                gross_amount: 507.35,
                packing_transport: 120,
                air_freight: 289.05,
                total: 916.40,
                no_of_box: 11,
                gross_weight: 123,
                net_weight: 97,
                payment_status: 'Pending'
            },
            {
                date: new Date('2024-02-18'),
                invoice_no: 'GL202403-037',
                company: 'MOVENPICK RESORTS KUREDHIVARU MALDIVES',
                gross_amount: 1254.80,
                packing_transport: 152.5,
                air_freight: 722.75,
                total: 2130.05,
                no_of_box: 23,
                gross_weight: 295,
                net_weight: 246,
                payment_status: 'Pending'
            },
            {
                date: new Date('2024-02-18'),
                invoice_no: 'GL202403-036',
                company: 'RAFFLES MALDIVES MERADHOO RESORT',
                gross_amount: 1470.25,
                packing_transport: 160,
                air_freight: 622.15,
                total: 2252.40,
                no_of_box: 26,
                gross_weight: 277,
                net_weight: 227,
                payment_status: 'Pending'
            },
            // January 2024
            {
                date: new Date('2024-01-17'),
                invoice_no: 'GL202401-003',
                company: 'DHAWA IHURU',
                gross_amount: 682.28,
                packing_transport: 120,
                air_freight: 723.45,
                total: 1525.73,
                no_of_box: 26,
                gross_weight: 273,
                net_weight: 198.2,
                payment_status: 'PAID'
            },
            {
                date: new Date('2024-01-17'),
                invoice_no: 'GL202401-004',
                company: 'CANAREEF RESORT PVT LTD',
                gross_amount: 612.9,
                packing_transport: 120,
                air_freight: 622.5,
                total: 1355.40,
                no_of_box: 26,
                gross_weight: 268,
                net_weight: 218,
                payment_status: 'PAID'
            },
            {
                date: new Date('2024-01-07'),
                invoice_no: 'GL202401-001',
                company: 'CANAREEF RESORT PVT LTD',
                gross_amount: 246.6,
                packing_transport: 120,
                air_freight: 230.55,
                total: 597.15,
                no_of_box: 8,
                gross_weight: 87,
                net_weight: 63.08,
                payment_status: 'PAID'
            },
            // December 2023
            {
                date: new Date('2023-12-26'),
                invoice_no: 'GQ-202312-102',
                company: 'DHAWA IHURU',
                gross_amount: 525.22,
                packing_transport: 120,
                air_freight: 495.55,
                total: 1140.77,
                no_of_box: 19,
                gross_weight: 187,
                net_weight: 152.4,
                payment_status: 'PAID'
            },
            {
                date: new Date('2023-12-26'),
                invoice_no: 'GQ-202312-103',
                company: 'BANYAN TREE VABBINFARU',
                gross_amount: 574.99,
                packing_transport: 120,
                air_freight: 601.55,
                total: 1296.54,
                no_of_box: 25,
                gross_weight: 227,
                net_weight: 188.6,
                payment_status: 'PAID'
            },
            {
                date: new Date('2023-12-05'),
                invoice_no: 'GQ-202312-101',
                company: 'CANAREEF RESORT PVT LTD',
                gross_amount: 505.55,
                packing_transport: 120,
                air_freight: 416.65,
                total: 1042.00,
                no_of_box: 167,
                gross_weight: 157,
                net_weight: 133,
                payment_status: 'PAID'
            }
        ];

        await Sale.insertMany(allSalesData);
        console.log(`Added ${allSalesData.length} sales records to database`);
    } catch (error) {
        console.error('Error initializing sales data:', error);
    }
}

// Initialize resorts data if none exists
async function initializeResorts() {
    try {
        // Clear all existing resorts first
        await Resort.deleteMany({});
        console.log('Cleared existing resorts');
        
        // Add the correct Gold Link resorts
        await Resort.insertMany(resortData);
        console.log('Added Gold Link resorts to MongoDB Atlas:', resortData.length);
        
        const count = await Resort.countDocuments();
        console.log('Total resorts in database:', count);
    } catch (err) {
        console.error('Error initializing Gold Link resorts:', err);
    }
}

// Initialize products data if none exists
async function initializeProducts() {
    try {
        // Clear all existing products first
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Add the products from priceListData
        await Product.insertMany(priceListData);
        console.log('Added products to MongoDB Atlas:', priceListData.length);
        
        const count = await Product.countDocuments();
        console.log('Total products in database:', count);
    } catch (err) {
        console.error('Error initializing products:', err);
    }
}

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goldlink', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    try {
        // Initialize data
        await initializeSalesData();
        await initializeResorts();
        await initializeProducts();
        console.log('Data initialization complete');
    } catch (error) {
        console.error('Error during data initialization:', error);
    }
})
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log('Products found:', products.length);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.get('/api/products/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Quotation Routes
app.post('/api/quotations', async (req, res) => {
    try {
        console.log('Received quotation data:', req.body);

        // Create new quotation
        const quotation = new Quotation({
            quotationNumber: req.body.quotationNumber,
            date: new Date(req.body.date),
            resortName: req.body.resortName,
            resortAddress: req.body.resortAddress,
            resortContact: req.body.resortContact,
            resortEmail: req.body.resortEmail,
            items: req.body.items.map(item => ({
                name: item.name,
                description: item.description,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                total: item.total
            })),
            subtotal: req.body.subtotal,
            tax: req.body.tax,
            total: req.body.total,
            notes: req.body.notes,
            status: req.body.status || 'Draft'
        });

        console.log('Created quotation object:', quotation);

        // Save to database
        const savedQuotation = await quotation.save();
        console.log('Saved quotation:', savedQuotation);

        res.status(201).json(savedQuotation);
    } catch (error) {
        console.error('Error saving quotation:', error);
        res.status(400).json({ 
            message: 'Error saving quotation', 
            error: error.message,
            details: error.errors 
        });
    }
});

app.get('/api/quotations', async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: -1 });
        res.json(quotations);
    } catch (error) {
        console.error('Error fetching quotations:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/quotations/:id', async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.json(quotation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/quotations/:id/pdf', async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        // Create PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=quotation-${quotation.quotationNumber || quotation._id.slice(-6)}.pdf`);

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add logo and company info
        const logoPath = path.join(__dirname, 'images', 'Goldlink logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 50 });
        }

        doc.fontSize(20)
           .text('Gold Link International', 110, 50)
           .fontSize(10)
           .text('5/3 Moo. 10 Khlong Nueng, Khlong Luang', 110, 75)
           .text('Pathumthani 12110, Thailand', 110, 90)
           .text('Phone: +66 613935877', 110, 105)
           .text('Email: sales@goldlink.co.th', 110, 120);

        // Add quotation details
        doc.fontSize(16)
           .text('QUOTATION', { align: 'center' })
           .moveDown();

        doc.fontSize(10)
           .text(`Quotation #: ${quotation.quotationNumber || quotation._id.slice(-6)}`)
           .text(`Date: ${quotation.date ? new Date(quotation.date).toLocaleDateString() : 'N/A'}`)
           .moveDown();

        // Add resort details
        doc.fontSize(12)
           .text('To:')
           .fontSize(10)
           .text(quotation.resortName || 'N/A')
           .text(quotation.resortAddress || '')
           .text(`Contact: ${quotation.resortContact || ''}`)
           .text(`Email: ${quotation.resortEmail || ''}`)
           .moveDown();

        // Add items table
        const tableTop = doc.y + 20;
        let currentY = tableTop;

        // Table headers
        doc.font('Helvetica-Bold');
        doc.text('Product', 50, currentY, { width: 200 });
        doc.text('Description', 250, currentY, { width: 150 });
        doc.text('Unit Price', 400, currentY, { width: 70, align: 'right' });
        doc.text('Qty', 470, currentY, { width: 30, align: 'right' });
        doc.text('Total', 500, currentY, { width: 70, align: 'right' });
        currentY += 20;

        // Draw header line
        doc.moveTo(50, currentY).lineTo(570, currentY).stroke();
        currentY += 10;

        // Table rows
        doc.font('Helvetica');
        (quotation.items || []).forEach(item => {
            // Check if we need a new page
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }

            const unitPrice = parseFloat(item.unitPrice) || 0;
            const quantity = parseInt(item.quantity) || 0;
            const total = unitPrice * quantity;

            doc.text(item.name || 'N/A', 50, currentY, { width: 200 });
            doc.text(item.description || '', 250, currentY, { width: 150 });
            doc.text(`$${unitPrice.toFixed(2)}`, 400, currentY, { width: 70, align: 'right' });
            doc.text(quantity.toString(), 470, currentY, { width: 30, align: 'right' });
            doc.text(`$${total.toFixed(2)}`, 500, currentY, { width: 70, align: 'right' });
            currentY += 20;
        });

        // Draw bottom line
        doc.moveTo(50, currentY).lineTo(570, currentY).stroke();
        currentY += 20;

        // Add totals
        const subtotal = parseFloat(quotation.subtotal) || 0;
        const tax = parseFloat(quotation.tax) || 0;
        const total = parseFloat(quotation.total) || 0;

        doc.font('Helvetica-Bold');
        doc.text('Subtotal:', 400, currentY, { width: 70, align: 'right' });
        doc.text(`$${subtotal.toFixed(2)}`, 500, currentY, { width: 70, align: 'right' });
        currentY += 20;

        doc.text('Tax (10%):', 400, currentY, { width: 70, align: 'right' });
        doc.text(`$${tax.toFixed(2)}`, 500, currentY, { width: 70, align: 'right' });
        currentY += 20;

        doc.text('Total:', 400, currentY, { width: 70, align: 'right' });
        doc.text(`$${total.toFixed(2)}`, 500, currentY, { width: 70, align: 'right' });

        // Add notes if present
        if (quotation.notes) {
            currentY += 40;
            doc.font('Helvetica-Bold').text('Notes:', 50, currentY);
            currentY += 20;
            doc.font('Helvetica').text(quotation.notes, 50, currentY, {
                width: 520,
                align: 'left'
            });
        }

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
});

// Get all resorts
app.get('/api/resorts', async (req, res) => {
    try {
        const resorts = await Resort.find({}).sort({ name: 1 });
        console.log('Fetched resorts from MongoDB Atlas:', resorts.length);
        
        if (resorts.length === 0) {
            // If somehow we have no resorts, add them again
            await Resort.insertMany(resortData);
            const newResorts = await Resort.find({}).sort({ name: 1 });
            console.log('Re-added resorts to MongoDB Atlas:', newResorts.length);
            res.json(newResorts);
        } else {
            res.json(resorts);
        }
    } catch (error) {
        console.error('Error fetching resorts from MongoDB Atlas:', error);
        res.status(500).json({ 
            message: 'Error fetching resorts from MongoDB Atlas',
            error: error.message 
        });
    }
});

// Add new resort
app.post('/api/resorts', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'company', 'building', 'road', 'city', 'contact'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`${field} is required`);
            }
        }

        // Check if resort already exists
        const existingResort = await Resort.findOne({ 
            name: req.body.name,
            company: req.body.company 
        });

        if (existingResort) {
            return res.status(400).json({ 
                message: 'Resort with this name and company already exists' 
            });
        }

        // Create new resort
        const resort = new Resort({
            name: req.body.name,
            company: req.body.company,
            building: req.body.building,
            road: req.body.road,
            area: req.body.area || '',
            city: req.body.city,
            pincode: req.body.pincode || '',
            contact: req.body.contact,
            email: req.body.email || '',
            reg_no: req.body.reg_no,
            gst_no: req.body.gst_no,
            contact_person: req.body.contact_person,
            country: req.body.country
        });

        // Save resort
        const savedResort = await resort.save();
        console.log('New resort added:', savedResort.name);
        res.status(201).json(savedResort);
    } catch (error) {
        console.error('Error adding resort:', error);
        res.status(400).json({ 
            message: 'Error adding resort', 
            error: error.message 
        });
    }
});

// Update resort
app.put('/api/resorts/:id', async (req, res) => {
    try {
        const resort = await Resort.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!resort) {
            return res.status(404).json({ message: 'Resort not found' });
        }
        
        console.log('Resort updated:', resort.name);
        res.json(resort);
    } catch (error) {
        console.error('Error updating resort:', error);
        res.status(400).json({ 
            message: 'Error updating resort', 
            error: error.message 
        });
    }
});

// Clear all quotations (Development only)
app.delete('/api/quotations/clear-all', async (req, res) => {
    try {
        // First try to drop the collection
        try {
            await mongoose.connection.db.dropCollection('quotations');
        } catch (dropError) {
            if (dropError.code !== 26) { // 26 is collection doesn't exist
                console.error('Error dropping collection:', dropError);
            }
        }

        // Then recreate it by creating the model
        await Quotation.createCollection();
        
        console.log('All quotations cleared');
        res.json({ message: 'All quotations cleared successfully' });
    } catch (error) {
        console.error('Error clearing quotations:', error);
        res.status(500).json({ message: 'Error clearing quotations', error: error.message });
    }
});

// Add test endpoint to check MongoDB connection
app.get('/api/test-db', async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB not connected');
        }

        // Get collection stats
        const stats = await mongoose.connection.db.collection('quotations').stats();
        
        res.json({
            message: 'Database connection is working',
            mongodbStatus: 'Connected',
            collectionExists: true,
            documentCount: stats.count,
            collectionSize: stats.size
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            message: 'Database error',
            error: error.message,
            mongodbStatus: mongoose.connection.readyState
        });
    }
});

// Update quotation
app.put('/api/quotations/:id', async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        // Update the quotation
        const updates = {
            ...req.body,
            date: new Date(req.body.date)
        };

        const updatedQuotation = await Quotation.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json(updatedQuotation);
    } catch (error) {
        console.error('Error updating quotation:', error);
        res.status(400).json({ message: error.message });
    }
});

// API endpoint to add sales
app.post('/api/sales', async (req, res) => {
    try {
        const sale = new Sale(req.body);
        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API endpoint to get all sales
app.get('/api/sales', async (req, res) => {
    try {
        console.log('Fetching sales data...');
        const sales = await Sale.find({}).sort({ date: -1 });
        console.log(`Found ${sales.length} sales records`);
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to get sales by date range
app.get('/api/sales/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const sales = await Sale.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to get sales summary
app.get('/api/sales/summary', async (req, res) => {
    try {
        const summary = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$total' },
                    totalBoxes: { $sum: '$no_of_box' },
                    totalWeight: { $sum: '$gross_weight' },
                    paidAmount: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'PAID'] }, '$total', 0]
                        }
                    },
                    pendingAmount: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'Pending'] }, '$total', 0]
                        }
                    }
                }
            }
        ]);
        res.json(summary[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to edit sales
app.put('/api/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ message: error.message });
    }
});

// Invoice API endpoints
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ date: -1 });
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ invoice_no: req.params.id });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/invoices', async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { invoice_no: req.params.id },
            req.body,
            { new: true }
        );
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({ invoice_no: req.params.id });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get last quotation number
app.get('/api/quotations/last', async (req, res) => {
    try {
        const lastQuotation = await Quotation.findOne().sort({ quotationNumber: -1 });
        res.json({ quotationNumber: lastQuotation ? lastQuotation.quotationNumber : null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch last quotation number' });
    }
});

// Get last invoice number
app.get('/api/invoices/last', async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
        res.json({ invoiceNumber: lastInvoice ? lastInvoice.invoiceNumber : null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch last invoice number' });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goldlink', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    try {
        // Initialize data
        await initializeSalesData();
        await initializeResorts();
        await initializeProducts();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error during data initialization:', error);
    }
})
.catch(err => console.error('MongoDB Atlas connection error:', err));