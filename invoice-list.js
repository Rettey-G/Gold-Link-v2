// Global variables
let invoices = [];
let filteredInvoices = [];

// Mock data for testing
const mockInvoices = [
    {
        _id: '1',
        invoice_no: 'GL202303-001',
        date: '2023-03-30',
        resortName: 'Resort A',
        totalAmount: 1200.00,
        status: 'pending'
    },
    {
        _id: '2',
        invoice_no: 'GL202303-002',
        date: '2023-03-29',
        resortName: 'Resort B',
        totalAmount: 1500.00,
        status: 'approved'
    }
];

// Initialize event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Load initial data
    await loadInvoices();

    // Setup event listeners
    document.getElementById('newInvoice').addEventListener('click', createNewInvoice);
    document.getElementById('searchInput').addEventListener('input', filterInvoices);
    document.getElementById('statusFilter').addEventListener('change', filterInvoices);
    document.getElementById('dateFilter').addEventListener('change', handleDateFilter);
    document.getElementById('startDate').addEventListener('change', filterInvoices);
    document.getElementById('endDate').addEventListener('change', filterInvoices);
    document.getElementById('exportBtn').addEventListener('click', exportInvoices);
    document.getElementById('saveEdit').addEventListener('click', saveInvoice);
    document.getElementById('deleteInvoice').addEventListener('click', deleteInvoice);
});

// Load invoices by converting approved quotations
async function loadInvoices() {
    try {
        // Fetch approved quotations
        const response = await fetch('/api/quotations?status=approved');
        if (!response.ok) throw new Error('Failed to fetch quotations');
        
        const quotations = await response.json();
        console.log('Loaded approved quotations:', quotations.length);
        
        // Convert quotations to invoices
        invoices = quotations.map(quotation => ({
            _id: quotation._id,
            invoice_no: `GL${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            resortName: quotation.resortName,
            totalAmount: quotation.totalAmount,
            status: 'pending'
        }));
        
        console.log('Generated invoices:', invoices.length);
        filteredInvoices = [...invoices];
        updateTable();
    } catch (error) {
        console.error('Error loading invoices:', error);
        alert('Failed to load invoices. Please try again.');
    }
}

// Create new invoice
function createNewInvoice() {
    // Generate new invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const invoiceNo = `GL${year}${month}-${String(invoices.length + 1).padStart(3, '0')}`;
    
    // Redirect to invoice page with new invoice number
    window.location.href = `invoice.html?id=${invoiceNo}`;
}

// Filter invoices based on search, status, and date
function filterInvoices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    filteredInvoices = invoices.filter(invoice => {
        // Search filter
        const matchesSearch = 
            invoice.invoice_no.toLowerCase().includes(searchTerm) ||
            invoice.company.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !statusFilter || invoice.payment_status === statusFilter;

        // Date filter
        let matchesDate = true;
        if (startDate && endDate) {
            const invoiceDate = new Date(invoice.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = invoiceDate >= start && invoiceDate <= end;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    updateTable();
}

// Handle date filter changes
function handleDateFilter() {
    const dateFilter = document.getElementById('dateFilter').value;
    const dateRangeContainer = document.getElementById('dateRangeContainer');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (dateFilter === 'custom') {
        dateRangeContainer.style.display = 'flex';
    } else {
        dateRangeContainer.style.display = 'none';
        
        const today = new Date();
        let start = new Date();
        
        switch (dateFilter) {
            case 'today':
                start = today;
                break;
            case 'week':
                start.setDate(today.getDate() - 7);
                break;
            case 'month':
                start.setMonth(today.getMonth() - 1);
                break;
            default:
                start = null;
        }

        if (start) {
            startDate.value = start.toISOString().split('T')[0];
            endDate.value = today.toISOString().split('T')[0];
        } else {
            startDate.value = '';
            endDate.value = '';
        }
    }

    filterInvoices();
}

// Update invoices table
function updateTable() {
    const tableBody = document.querySelector('#invoicesTable tbody');
    tableBody.innerHTML = '';

    filteredInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.invoice_no}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${invoice.company}</td>
            <td>${formatCurrency(invoice.total)}</td>
            <td>
                <span class="badge ${invoice.payment_status === 'PAID' ? 'bg-success' : 'bg-warning'}">
                    ${invoice.payment_status}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary" onclick="viewInvoice('${invoice.invoice_no}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="editInvoice('${invoice.invoice_no}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success" onclick="printInvoice('${invoice.invoice_no}')">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// View invoice
function viewInvoice(invoiceNo) {
    window.location.href = `invoice.html?id=${invoiceNo}`;
}

// Edit invoice
function editInvoice(invoiceNo) {
    const invoice = invoices.find(inv => inv.invoice_no === invoiceNo);
    if (!invoice) return;

    // Fill form with invoice data
    document.getElementById('editInvoiceNo').value = invoice.invoice_no;
    document.getElementById('editCompany').value = invoice.company;
    document.getElementById('editDate').value = new Date(invoice.date).toISOString().split('T')[0];
    document.getElementById('editDueDate').value = new Date(invoice.due_date).toISOString().split('T')[0];
    document.getElementById('editPaymentStatus').value = invoice.payment_status;
    document.getElementById('editShippingMethod').value = invoice.shipping_method;
    document.getElementById('editPackingTransport').value = invoice.packing_transport;
    document.getElementById('editAirFreight').value = invoice.air_freight;
    document.getElementById('editNotes').value = invoice.notes;

    // Show modal
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

// Save invoice changes
async function saveInvoice() {
    const invoiceNo = document.getElementById('editInvoiceNo').value;
    const updatedInvoice = {
        company: document.getElementById('editCompany').value,
        date: document.getElementById('editDate').value,
        due_date: document.getElementById('editDueDate').value,
        payment_status: document.getElementById('editPaymentStatus').value,
        shipping_method: document.getElementById('editShippingMethod').value,
        packing_transport: parseFloat(document.getElementById('editPackingTransport').value),
        air_freight: parseFloat(document.getElementById('editAirFreight').value),
        notes: document.getElementById('editNotes').value
    };

    try {
        const response = await fetch(`/api/invoices/${invoiceNo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedInvoice)
        });

        if (!response.ok) throw new Error('Failed to update invoice');

        // Close modal and reload data
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        await loadInvoices();
    } catch (error) {
        console.error('Error updating invoice:', error);
        alert('Failed to update invoice. Please try again.');
    }
}

// Delete invoice
async function deleteInvoice() {
    const invoiceNo = document.getElementById('editInvoiceNo').value;
    
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
        const response = await fetch(`/api/invoices/${invoiceNo}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete invoice');

        // Close modal and reload data
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        await loadInvoices();
    } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
    }
}

// Print invoice
function printInvoice(invoiceNo) {
    window.open(`invoice.html?id=${invoiceNo}&print=true`, '_blank');
}

// Export invoices to Excel
function exportInvoices() {
    const ws = XLSX.utils.json_to_sheet(filteredInvoices.map(invoice => ({
        'Invoice No': invoice.invoice_no,
        'Date': formatDate(invoice.date),
        'Company': invoice.company,
        'Amount': invoice.total,
        'Status': invoice.payment_status
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, 'invoices.xlsx');
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
        month: 'short',
        day: 'numeric'
    });
}
