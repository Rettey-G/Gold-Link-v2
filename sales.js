// Base API URL - Change based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? '/api' 
    : '/.netlify/functions/server';

// Global variables
let salesData = [];
let filteredData = [];

// Global variables for charts
let monthlyTrendChart = null;
let paymentStatusChart = null;
let companyChart = null;
let weightRevenueChart = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loaded, initializing...');
    
    // Load initial data
    await loadSalesData();

    // Add event listeners for report options
    document.getElementById('includeShipping').addEventListener('change', updateReport);
    document.getElementById('includePacking').addEventListener('change', updateReport);
    document.getElementById('showPaidOnly').addEventListener('change', updateReport);
    document.getElementById('showPendingOnly').addEventListener('change', updateReport);

    // View options listeners
    document.getElementById('viewGrossOnly').addEventListener('click', () => setViewMode('gross'));
    document.getElementById('viewWithPT').addEventListener('click', () => setViewMode('pt'));
    document.getElementById('viewWithFreight').addEventListener('click', () => setViewMode('freight'));
    document.getElementById('viewAll').addEventListener('click', () => setViewMode('all'));

    // Date range filter listeners
    document.getElementById('startDate').addEventListener('change', updateReport);
    document.getElementById('endDate').addEventListener('change', updateReport);

    // Search input listener
    document.getElementById('searchInput').addEventListener('input', updateReport);

    // Edit modal save button
    document.getElementById('saveEdit').addEventListener('click', saveEdit);

    // Export button listener
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
});

// Load sales data from server
async function loadSalesData() {
    try {
        console.log('Loading sales data...');
        const response = await fetch(`${API_BASE_URL}/sales`);
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }
        salesData = await response.json();
        console.log('Sales data loaded:', salesData.length, 'records');
        
        // Initialize filtered data
        filteredData = [...salesData];
        
        // Update the display
        updateReport();
    } catch (error) {
        console.error('Error loading sales:', error);
        alert('Error loading sales data. Please try again.');
    }
}

// Set view mode for columns
function setViewMode(mode) {
    const ptColumns = document.querySelectorAll('.pt-column');
    const freightColumns = document.querySelectorAll('.freight-column');
    
    switch(mode) {
        case 'gross':
            ptColumns.forEach(col => col.style.display = 'none');
            freightColumns.forEach(col => col.style.display = 'none');
            break;
        case 'pt':
            ptColumns.forEach(col => col.style.display = '');
            freightColumns.forEach(col => col.style.display = 'none');
            break;
        case 'freight':
            ptColumns.forEach(col => col.style.display = 'none');
            freightColumns.forEach(col => col.style.display = '');
            break;
        case 'all':
            ptColumns.forEach(col => col.style.display = '');
            freightColumns.forEach(col => col.style.display = '');
            break;
    }
}

// Open edit modal
function openEditModal(sale) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    
    // Fill form with sale data
    document.getElementById('editId').value = sale._id;
    document.getElementById('editInvoiceNo').value = sale.invoice_no;
    document.getElementById('editCompany').value = sale.company;
    document.getElementById('editGrossAmount').value = sale.gross_amount;
    document.getElementById('editPT').value = sale.packing_transport;
    document.getElementById('editFreight').value = sale.air_freight;
    document.getElementById('editBoxes').value = sale.no_of_box;
    document.getElementById('editGrossWeight').value = sale.gross_weight;
    document.getElementById('editNetWeight').value = sale.net_weight;
    document.getElementById('editPaymentStatus').value = sale.payment_status;
    
    modal.show();
}

// Save edited sale
async function saveEdit() {
    const id = document.getElementById('editId').value;
    const updatedSale = {
        company: document.getElementById('editCompany').value,
        gross_amount: parseFloat(document.getElementById('editGrossAmount').value),
        packing_transport: parseFloat(document.getElementById('editPT').value),
        air_freight: parseFloat(document.getElementById('editFreight').value),
        no_of_box: parseInt(document.getElementById('editBoxes').value),
        gross_weight: parseFloat(document.getElementById('editGrossWeight').value),
        net_weight: parseFloat(document.getElementById('editNetWeight').value),
        payment_status: document.getElementById('editPaymentStatus').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSale)
        });

        if (!response.ok) {
            throw new Error('Failed to update sale');
        }

        // Close modal and reload data
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        await loadSalesData();
    } catch (error) {
        console.error('Error updating sale:', error);
        alert('Error updating sale. Please try again.');
    }
}

// Update report based on selected options
function updateReport() {
    // Get filter values
    const includeShipping = document.getElementById('includeShipping').checked;
    const includePacking = document.getElementById('includePacking').checked;
    const showPaidOnly = document.getElementById('showPaidOnly').checked;
    const showPendingOnly = document.getElementById('showPendingOnly').checked;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Filter data based on criteria
    filteredData = salesData.filter(sale => {
        // Date filter
        const saleDate = new Date(sale.date);
        if (startDate && saleDate < new Date(startDate)) return false;
        if (endDate && saleDate > new Date(endDate)) return false;

        // Payment status filter
        if (showPaidOnly && sale.payment_status !== 'PAID') return false;
        if (showPendingOnly && sale.payment_status !== 'Pending') return false;

        // Search filter
        if (searchQuery && !sale.company.toLowerCase().includes(searchQuery) &&
            !sale.invoice_no.toLowerCase().includes(searchQuery)) {
            return false;
        }

        return true;
    });

    // Calculate totals
    let totalGrossAmount = 0;
    let totalWithPT = 0;
    let totalWithFreight = 0;
    let grandTotal = 0;

    filteredData.forEach(sale => {
        totalGrossAmount += sale.gross_amount || 0;
        totalWithPT += sale.gross_amount + (includePacking ? (sale.packing_transport || 0) : 0);
        totalWithFreight += sale.gross_amount + (includeShipping ? (sale.air_freight || 0) : 0);
        grandTotal += sale.gross_amount + 
                     (includePacking ? (sale.packing_transport || 0) : 0) + 
                     (includeShipping ? (sale.air_freight || 0) : 0);
    });

    // Update summary cards
    document.getElementById('totalSales').textContent = formatCurrency(totalGrossAmount);
    document.getElementById('totalWithPT').textContent = formatCurrency(totalWithPT);
    document.getElementById('totalWithFreight').textContent = formatCurrency(totalWithFreight);
    document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);

    // Update table and charts
    updateTable();
    updateCharts();
}

// Update charts with filtered data
function updateCharts() {
    try {
        // Monthly trend chart
        const monthlyData = {};
        filteredData.forEach(sale => {
            const month = new Date(sale.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            monthlyData[month] = (monthlyData[month] || 0) + sale.total;
        });

        if (monthlyTrendChart) monthlyTrendChart.destroy();
        monthlyTrendChart = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Monthly Sales',
                    data: Object.values(monthlyData),
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Monthly Sales Trend' }
                }
            }
        });

        // Payment status chart
        const paymentData = {
            'Paid': filteredData.filter(sale => sale.payment_status === 'PAID').length,
            'Pending': filteredData.filter(sale => sale.payment_status === 'Pending').length
        };

        if (paymentStatusChart) paymentStatusChart.destroy();
        paymentStatusChart = new Chart(document.getElementById('paymentChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(paymentData),
                datasets: [{
                    data: Object.values(paymentData),
                    backgroundColor: ['#4CAF50', '#FFC107']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Payment Status Distribution' }
                }
            }
        });

        // Company-wise sales chart
        const companyData = {};
        filteredData.forEach(sale => {
            companyData[sale.company] = (companyData[sale.company] || 0) + sale.total;
        });

        if (companyChart) companyChart.destroy();
        companyChart = new Chart(document.getElementById('companyChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: Object.keys(companyData),
                datasets: [{
                    label: 'Total Sales',
                    data: Object.values(companyData),
                    backgroundColor: '#2196F3'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Company-wise Sales' }
                }
            }
        });

        // Weight vs Revenue chart
        if (weightRevenueChart) weightRevenueChart.destroy();
        weightRevenueChart = new Chart(document.getElementById('weightRevenueChart').getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Weight vs Revenue',
                    data: filteredData.map(sale => ({
                        x: sale.gross_weight,
                        y: sale.total
                    })),
                    backgroundColor: '#9C27B0'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Weight vs Revenue Correlation' }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Gross Weight (kg)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Revenue ($)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Update table with filtered data
function updateTable() {
    const tableBody = document.querySelector('#salesTable tbody');
    tableBody.innerHTML = '';

    filteredData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(sale.date)}</td>
            <td>${sale.invoice_no}</td>
            <td>${sale.company}</td>
            <td>${formatCurrency(sale.gross_amount)}</td>
            <td class="pt-column">${formatCurrency(sale.packing_transport)}</td>
            <td class="freight-column">${formatCurrency(sale.air_freight)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${sale.no_of_box}</td>
            <td>${sale.gross_weight}</td>
            <td>${sale.net_weight}</td>
            <td><span class="badge ${sale.payment_status === 'PAID' ? 'bg-success' : 'bg-warning'}">${sale.payment_status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModal(${JSON.stringify(sale).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
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

// Export to Excel
function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    // Convert filtered data to worksheet format
    const wsData = filteredData.map(sale => ({
        'Date': formatDate(sale.date),
        'Invoice No': sale.invoice_no,
        'Company': sale.company,
        'Gross Amount': sale.gross_amount,
        'Packing & Transport': sale.packing_transport,
        'Air Freight': sale.air_freight,
        'Total': sale.total,
        'No. of Boxes': sale.no_of_box,
        'Gross Weight': sale.gross_weight,
        'Net Weight': sale.net_weight,
        'Payment Status': sale.payment_status
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    
    // Save the file
    XLSX.writeFile(wb, 'sales_report.xlsx');
}
