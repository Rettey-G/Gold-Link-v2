// DOM Elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const quotationTable = document.getElementById('quotationTable').querySelector('tbody');

// Base API URL - Change based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? '/api' 
    : '/.netlify/functions/server';

// Load quotations when page loads
document.addEventListener('DOMContentLoaded', loadQuotations);

// Add event listeners for filters
searchInput.addEventListener('input', filterQuotations);
statusFilter.addEventListener('change', filterQuotations);

// Load all quotations
async function loadQuotations() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`);
        if (!response.ok) {
            throw new Error('Failed to fetch quotations');
        }
        const quotations = await response.json();
        displayQuotations(quotations);
    } catch (error) {
        console.error('Error loading quotations:', error);
        showToast('Failed to load quotations', 'error');
    }
}

// Display quotations in table
function displayQuotations(quotations) {
    quotationTable.innerHTML = '';
    quotations.forEach(quotation => {
        const row = document.createElement('tr');
        const date = new Date(quotation.createdAt).toLocaleDateString();
        row.innerHTML = `
            <td>${quotation._id.slice(-6)}</td>
            <td>${date}</td>
            <td>${quotation.resortName}</td>
            <td>$${quotation.totalAmount.toFixed(2)}</td>
            <td><span class="status-${quotation.status.toLowerCase()}">${quotation.status}</span></td>
            <td>
                <button onclick="viewQuotation('${quotation._id}')" class="btn-icon" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="downloadQuotation('${quotation._id}')" class="btn-icon" title="Download PDF">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        quotationTable.appendChild(row);
    });
}

// Filter quotations
function filterQuotations() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusTerm = statusFilter.value.toLowerCase();
    const rows = quotationTable.getElementsByTagName('tr');

    for (const row of rows) {
        const resortName = row.cells[2].textContent.toLowerCase();
        const quotationNumber = row.cells[0].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();

        const matchesSearch = resortName.includes(searchTerm) || quotationNumber.includes(searchTerm);
        const matchesStatus = !statusTerm || status === statusTerm;

        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    }
}

// View quotation details
function viewQuotation(id) {
    window.location.href = `quotation.html?id=${id}`;
}

// Download quotation as PDF
async function downloadQuotation(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}/pdf`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${id.slice(-6)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading quotation:', error);
        showToast('Failed to download quotation', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
