// Global variables
let invoice = null;
let items = [];

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Get invoice ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    const autoPrint = urlParams.get('print') === 'true';

    if (invoiceId) {
        await loadInvoice(invoiceId);
        if (autoPrint) {
            setTimeout(() => window.print(), 1000);
        }
    } else {
        alert('No invoice ID specified');
        window.location.href = 'invoice-list.html';
    }
});

// Load invoice data
async function loadInvoice(invoiceId) {
    try {
        const response = await fetch(`/api/invoices/${invoiceId}`);
        if (!response.ok) throw new Error('Failed to fetch invoice');
        
        invoice = await response.json();
        items = invoice.items || [];
        
        updateInvoiceDisplay();
    } catch (error) {
        console.error('Error loading invoice:', error);
        alert('Failed to load invoice. Please try again.');
    }
}

// Update invoice display
function updateInvoiceDisplay() {
    // Update invoice header
    document.getElementById('invoiceNo').textContent = invoice.invoice_no;
    document.getElementById('invoiceDate').textContent = formatDate(invoice.date);
    document.getElementById('dueDate').textContent = formatDate(invoice.due_date);

    // Update company details
    document.getElementById('companyName').textContent = invoice.company;
    document.getElementById('companyAddress').textContent = invoice.address || '';
    document.getElementById('companyContact').textContent = invoice.contact || '';
    document.getElementById('companyEmail').textContent = invoice.email || '';

    // Update shipping details
    document.getElementById('shippingAddress').textContent = invoice.shipping_address || invoice.address || '';
    document.getElementById('shippingMethod').textContent = invoice.shipping_method || '';
    document.getElementById('shippingTerms').textContent = invoice.shipping_terms || '';

    // Update items table
    const tableBody = document.getElementById('itemsTableBody');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${formatCurrency(item.unit_price)}</td>
            <td>${formatCurrency(item.quantity * item.unit_price)}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('packingTransport').textContent = formatCurrency(invoice.packing_transport);
    document.getElementById('airFreight').textContent = formatCurrency(invoice.air_freight);
    document.getElementById('grandTotal').textContent = formatCurrency(
        subtotal + (invoice.packing_transport || 0) + (invoice.air_freight || 0)
    );

    // Update notes and terms
    document.getElementById('notes').textContent = invoice.notes || '';
    document.getElementById('terms').textContent = invoice.terms || `
        1. Payment is due within 30 days
        2. Please include invoice number on your payment
        3. Make all checks payable to Gold Link Trading
        4. Bank transfer details will be provided upon request
    `;
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
}

// Helper function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate invoice number
async function generateInvoiceNumber() {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/last`);
        const data = await response.json();
        
        let lastNumber = 0;
        if (data && data.invoiceNumber) {
            const match = data.invoiceNumber.match(/INVGL(\d+)/);
            if (match) {
                lastNumber = parseInt(match[1]);
            }
        }
        
        const newNumber = lastNumber + 1;
        const formattedNumber = `INVGL${String(newNumber).padStart(5, '0')}`;
        return formattedNumber;
    } catch (error) {
        console.error('Error generating invoice number:', error);
        // If API fails, start with INVGL00001
        return 'INVGL00001';
    }
}
