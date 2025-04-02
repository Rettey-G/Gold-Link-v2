// Base API URL - Change based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? '/api' 
    : '/.netlify/functions/server';

// DOM Elements
const resortSelect = document.getElementById('resortSelect');
const resortDetails = document.getElementById('resortDetails');
const resortCompany = document.getElementById('resortCompany');
const resortAddress = document.getElementById('resortAddress');
const resortContact = document.getElementById('resortContact');
const resortContactPerson = document.getElementById('resortContactPerson');
const resortEmail = document.getElementById('resortEmail');
const resortRegNo = document.getElementById('resortRegNo');
const resortGstNo = document.getElementById('resortGstNo');
const quotationNumber = document.getElementById('quotationNumber');
const quotationDate = document.getElementById('quotationDate');
const itemsTable = document.getElementById('itemsTable').querySelector('tbody');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const addItemBtn = document.getElementById('addItemBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const printQuotationBtn = document.getElementById('printQuotationBtn');
const quotationNotes = document.getElementById('quotationNotes');
const newQuotationBtn = document.getElementById('newQuotationBtn');
const quotationForm = document.getElementById('quotationForm');
const quotationHistory = document.getElementById('quotationHistory');
const quotationTable = document.getElementById('quotationTable').querySelector('tbody');
const searchInput = document.getElementById('searchInput');

// Data
let resorts = [];
let products = [];
let quotations = [];
let selectedProduct = null;

// Load resorts on page load
async function loadResorts() {
    try {
        console.log('Loading resorts...');
        const response = await fetch(`${API_BASE_URL}/resorts`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch resorts');
        }
        
        resorts = await response.json();
        console.log('Loaded resorts:', resorts.length);

        // Populate resort select
        const resortSelect = document.getElementById('resortSelect');
        resortSelect.innerHTML = '<option value="">Select Resort</option>';
        
        // Sort resorts by name
        resorts.sort((a, b) => a.name.localeCompare(b.name));
        
        resorts.forEach(resort => {
            const option = document.createElement('option');
            option.value = resort._id; // Use MongoDB _id
            option.textContent = `${resort.name} (${resort.company})`;
            resortSelect.appendChild(option);
        });

        // Add change event listener
        resortSelect.addEventListener('change', function() {
            const selectedResort = resorts.find(r => r._id === this.value);
            if (selectedResort) {
                updateResortDetails(selectedResort);
            } else {
                clearResortDetails();
            }
        });

        showToast('Resorts loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading resorts:', error);
        showToast('Failed to load resorts: ' + error.message, 'error');
    }
}

// Function to update resort details
function updateResortDetails(resort) {
    if (!resort) {
        clearResortDetails();
        return;
    }

    const resortDetails = document.getElementById('resortDetails');
    resortDetails.style.display = 'block';
    
    // Format address with all components
    const address = [
        resort.building,
        resort.road,
        resort.area,
        resort.city,
        resort.country,
        resort.pincode
    ].filter(Boolean).join(', ');
    
    document.getElementById('resortCompany').textContent = resort.company;
    document.getElementById('resortAddress').textContent = address;
    document.getElementById('resortContact').textContent = resort.contact || 'N/A';
    document.getElementById('resortContactPerson').textContent = resort.contact_person || 'N/A';
    document.getElementById('resortEmail').textContent = resort.email || 'N/A';
    document.getElementById('resortRegNo').textContent = resort.reg_no || 'N/A';
    document.getElementById('resortGstNo').textContent = resort.gst_no || 'N/A';
}

// Function to clear resort details
function clearResortDetails() {
    const resortDetails = document.getElementById('resortDetails');
    resortDetails.style.display = 'none';
    
    document.getElementById('resortCompany').textContent = '';
    document.getElementById('resortAddress').textContent = '';
    document.getElementById('resortContact').textContent = '';
    document.getElementById('resortContactPerson').textContent = '';
    document.getElementById('resortEmail').textContent = '';
    document.getElementById('resortRegNo').textContent = '';
    document.getElementById('resortGstNo').textContent = '';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing...');
    
    // Load initial data
    await loadResorts();
    await loadProducts();
    await loadQuotations();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize quotation number
    generateQuotationNumber();
    
    // Add test buttons only in development mode
    if (window.location.hostname === 'localhost') {
        const testButtons = `
            <div class="test-buttons" style="margin-bottom: 20px;">
                <button onclick="testDatabaseConnection()" class="btn btn-primary">
                    <i class="fas fa-database"></i> Test DB Connection
                </button>
                <button onclick="clearAllQuotations()" class="btn btn-danger">
                    <i class="fas fa-trash"></i> Clear All Quotations
                </button>
                <button onclick="createTestQuotation()" class="btn btn-info">
                    <i class="fas fa-plus"></i> Create Test Quotation
                </button>
            </div>
        `;
        
        const quotationList = document.getElementById('quotationList');
        if (quotationList) {
            quotationList.insertAdjacentHTML('afterbegin', testButtons);
        }
    }
    
    // Test database connection on page load
    testDatabaseConnection();
});

// Function to setup event listeners
function setupEventListeners() {
    const resortSelect = document.getElementById('resortSelect');
    const searchInput = document.getElementById('searchInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const saveQuotationBtn = document.getElementById('saveQuotationBtn');
    const printQuotationBtn = document.getElementById('printQuotationBtn');
    
    if (resortSelect) {
        resortSelect.addEventListener('change', function() {
            const selectedResort = resorts.find(r => r._id === this.value);
            updateResortDetails(selectedResort);
        });
    }
    
    if (addItemBtn) {
        addItemBtn.addEventListener('click', showProductModal);
    }
    
    if (saveQuotationBtn) {
        saveQuotationBtn.addEventListener('click', () => saveQuotation());
    }
    
    if (printQuotationBtn) {
        printQuotationBtn.addEventListener('click', printQuotation);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterQuotations(searchTerm);
        });
    }
    
    // Setup quantity change listeners
    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('quantity')) {
            updateTotal(e.target);
        }
    });
    
    // Setup remove item listeners
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-item')) {
            removeItem(e.target);
        }
    });
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Products loaded:', data.length);
        return data;
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
        return [];
    }
}

// Load quotations from API
async function loadQuotations() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`);
        const quotations = await response.json();
        displayQuotations(quotations);
    } catch (error) {
        console.error('Error loading quotations:', error);
        showToast('Failed to load quotations', 'error');
    }
}

// Display quotations in table
function displayQuotations(quotations) {
    const tbody = document.querySelector('#quotationTable tbody');
    tbody.innerHTML = '';

    quotations.forEach(quotation => {
        const row = document.createElement('tr');
        const date = quotation.date ? new Date(quotation.date).toLocaleDateString() : 'N/A';
        const total = parseFloat(quotation.total) || 0;
        
        row.innerHTML = `
            <td>${quotation.quotationNumber || quotation._id.slice(-6)}</td>
            <td>${date}</td>
            <td>${quotation.resortName || 'N/A'}</td>
            <td>$${total.toFixed(2)}</td>
            <td>${quotation.status || 'Draft'}</td>
            <td>
                <button class="btn btn-view" data-id="${quotation._id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-edit" data-id="${quotation._id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-download" data-id="${quotation._id}">
                    <i class="fas fa-download"></i> Download
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => viewQuotation(btn.dataset.id));
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editQuotation(btn.dataset.id));
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', () => downloadQuotation(btn.dataset.id));
    });
}

// Filter quotations
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = quotationTable.getElementsByTagName('tr');

    for (const row of rows) {
        const resortName = row.cells[2].textContent.toLowerCase();
        const quotationNumber = row.cells[0].textContent.toLowerCase();
        const matches = resortName.includes(searchTerm) || quotationNumber.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    }
});

// Function to show product selection modal
async function showProductModal() {
    try {
        const products = await loadProducts();
        if (!products || products.length === 0) {
            showToast('No products available', 'error');
            return;
        }

        const modal = document.getElementById('productModal');
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Clear existing items

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-name">
                        <div class="english-name">${product.name}</div>
                        <div class="thai-name">${product.thaiName || ''}</div>
                    </div>
                </td>
                <td>${product.description || ''}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control quantity-input" value="1" min="1">
                </td>
                <td>
                    <button class="btn btn-primary btn-sm add-product" data-product='${JSON.stringify(product)}'>
                        <i class="fas fa-plus"></i> Add
                    </button>
                </td>
            `;

            // Add click handler for the Add button
            const addButton = row.querySelector('.add-product');
            addButton.addEventListener('click', function() {
                const quantity = parseInt(row.querySelector('.quantity-input').value) || 1;
                const productData = JSON.parse(this.getAttribute('data-product'));
                addItemToQuotation(productData, quantity);
                modal.style.display = 'none';
            });

            productList.appendChild(row);
        });

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error showing product modal:', error);
        showToast('Error loading product selection', 'error');
    }
}

// Function to add item to quotation
function addItemToQuotation(product, quantity) {
    try {
        console.log('Adding item:', product, 'quantity:', quantity);
        const itemsTable = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
        
        // Create new row
        const row = document.createElement('tr');
        const total = product.price * quantity;
        
        row.innerHTML = `
            <td>
                <div class="product-name">
                    <div class="english-name">${product.name}</div>
                    <div class="thai-name">${product.thaiName || ''}</div>
                </div>
            </td>
            <td>${product.description || ''}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <input type="number" class="form-control quantity" value="${quantity}" min="1" onchange="updateTotal(this)">
            </td>
            <td class="total">$${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        itemsTable.appendChild(row);
        calculateTotals();
        showToast('Item added successfully', 'success');
    } catch (error) {
        console.error('Error adding item:', error);
        showToast('Failed to add item', 'error');
    }
}

// Function to update total when quantity changes
function updateTotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.cells[2].textContent.replace('$', ''));
    const quantity = parseInt(input.value) || 0;
    const total = price * quantity;
    row.querySelector('.total').textContent = '$' + total.toFixed(2);
    calculateTotals();
}

// Function to remove item
function removeItem(button) {
    const row = button.closest('tr');
    row.remove();
    calculateTotals();
    showToast('Item removed', 'success');
}

// Function to calculate totals
function calculateTotals() {
    let subtotal = 0;
    const rows = document.getElementById('itemsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const total = parseFloat(row.querySelector('.total').textContent.replace('$', '')) || 0;
        subtotal += total;
    });
    
    const tax = subtotal * 0.13; // 13% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    
    return { subtotal, tax, total };
}

// Function to save quotation
async function saveQuotation(isUpdate = false) {
    try {
        const resort = getSelectedResort();
        if (!resort) {
            showToast('Please select a resort', 'error');
            return;
        }

        const items = [];
        const rows = document.querySelectorAll('#itemsTable tbody tr');
        rows.forEach(row => {
            const cells = row.cells;
            items.push({
                name: cells[0].textContent,
                description: cells[1].textContent,
                price: parseFloat(cells[2].textContent.replace('$', '')),
                quantity: parseInt(cells[3].querySelector('input').value),
                total: parseFloat(cells[4].textContent.replace('$', ''))
            });
        });

        if (items.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }

        const { subtotal, tax, total } = calculateTotals();

        const quotationData = {
            resortId: resort._id,
            resortName: resort.name,
            company: resort.company,
            address: document.getElementById('resortAddress').textContent,
            contact: resort.contact,
            email: resort.email,
            reg_no: resort.reg_no,
            gst_no: resort.gst_no,
            items: items,
            subtotal: subtotal,
            tax: tax,
            total: total,
            notes: document.getElementById('quotationNotes')?.value || '',
            date: new Date().toISOString(),
            number: document.getElementById('quotationNumber').textContent
        };

        const url = isUpdate ? `${API_BASE_URL}/quotations/${quotationData._id}` : `${API_BASE_URL}/quotations`;
        const method = isUpdate ? 'PUT' : 'POST';

        console.log('Saving quotation data:', quotationData);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotationData)
        });

        console.log('Saved quotation response:', response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save quotation');
        }

        const savedQuotation = await response.json();
        
        showToast(`Quotation ${isUpdate ? 'updated' : 'saved'} successfully`, 'success');
        
        // Reset form and update UI
        resetQuotationForm();
        await loadQuotations();
        
        // Show new quotation button
        const newQuotationBtn = document.getElementById('newQuotationBtn');
        if (newQuotationBtn) {
            newQuotationBtn.style.display = 'block';
        }
        
        // Hide quotation form
        const quotationForm = document.getElementById('quotationForm');
        if (quotationForm) {
            quotationForm.style.display = 'none';
        }

        return savedQuotation;
    } catch (error) {
        console.error('Error saving quotation:', error);
        showToast('Failed to save quotation: ' + error.message, 'error');
    }
}

// Function to get selected resort
function getSelectedResort() {
    const resortSelect = document.getElementById('resortSelect');
    const selectedResortId = resortSelect.value;
    
    if (!selectedResortId) {
        return null;
    }
    
    return resorts.find(resort => resort._id === selectedResortId);
}

// Function to reset quotation form
function resetQuotationForm() {
    // Clear hidden quotation ID
    document.getElementById('quotationId').value = '';
    
    // Generate new quotation number
    document.getElementById('quotationNumber').textContent = generateQuotationNumber();
    
    // Reset resort select
    document.getElementById('resortSelect').selectedIndex = 0;
    
    // Clear items table
    document.getElementById('itemsTable').getElementsByTagName('tbody')[0].innerHTML = '';
    
    // Clear notes
    document.getElementById('quotationNotes').value = '';
    
    // Reset save button
    const saveBtn = document.querySelector('#saveQuotationBtn');
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Quotation';
    saveBtn.onclick = () => saveQuotation(false);
    
    // Calculate totals
    calculateTotals();
}

// Function to view quotation details
async function viewQuotation(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quotation');
        }
        
        const quotation = await response.json();
        const modal = document.getElementById('viewQuotationModal');
        const content = document.getElementById('viewQuotationContent');

        // Format the quotation details in HTML
        content.innerHTML = `
            <div class="quotation-view">
                <div class="view-header">
                    <h2>Quotation #${quotation.quotationNumber || quotation._id.slice(-6)}</h2>
                    <div class="meta-info">
                        <p><strong>Date:</strong> ${quotation.date ? new Date(quotation.date).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Status:</strong> ${quotation.status || 'Draft'}</p>
                    </div>
                </div>

                <div class="view-body">
                    <div class="company-info">
                        <h3>Gold Link International</h3>
                        <p>5/3 Moo. 10 Khlong Nueng, Khlong Luang</p>
                        <p>Pathumthani 12110, Thailand</p>
                        <p>Phone: +66 613935877</p>
                        <p>Email: sales@goldlink.co.th</p>
                    </div>

                    <div class="resort-info">
                        <h3>Resort Information</h3>
                        <p><strong>Name:</strong> ${quotation.resortName || 'N/A'}</p>
                        <p><strong>Address:</strong> ${quotation.resortAddress || 'N/A'}</p>
                        <p><strong>Contact:</strong> ${quotation.resortContact || 'N/A'}</p>
                        <p><strong>Email:</strong> ${quotation.resortEmail || 'N/A'}</p>
                    </div>

                    <div class="items-table">
                        <h3>Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Description</th>
                                    <th>Unit Price (USD)</th>
                                    <th>Quantity</th>
                                    <th>Total (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(quotation.items || []).map(item => {
                                    const unitPrice = parseFloat(item.unitPrice) || 0;
                                    const quantity = parseInt(item.quantity) || 0;
                                    const total = unitPrice * quantity;
                                    return `
                                        <tr>
                                            <td>${item.name || 'N/A'}</td>
                                            <td>${item.description || ''}</td>
                                            <td class="text-right">$${unitPrice.toFixed(2)}</td>
                                            <td class="text-right">${quantity}</td>
                                            <td class="text-right">$${total.toFixed(2)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
                                    <td class="text-right">$${(parseFloat(quotation.subtotal) || 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="4" class="text-right"><strong>Tax (10%):</strong></td>
                                    <td class="text-right">$${(parseFloat(quotation.tax) || 0).toFixed(2)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td colspan="4" class="text-right"><strong>Total:</strong></td>
                                    <td class="text-right">$${(parseFloat(quotation.total) || 0).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    ${quotation.notes ? `
                        <div class="notes">
                            <h3>Notes</h3>
                            <p>${quotation.notes}</p>
                        </div>
                    ` : ''}

                    <div class="modal-actions">
                        <button class="btn btn-download" onclick="downloadQuotation('${quotation._id}')">
                            <i class="fas fa-download"></i> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';

        // Close modal when clicking the close button or outside the modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

    } catch (error) {
        console.error('Error viewing quotation:', error);
        showToast('Failed to load quotation details', 'error');
    }
}

// Function to download quotation as PDF
async function downloadQuotation(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}/pdf`);
        if (!response.ok) {
            throw new Error('Failed to download PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('PDF downloaded successfully', 'success');
    } catch (error) {
        console.error('Error downloading quotation:', error);
        showToast('Failed to download quotation', 'error');
    }
}

// Function to load quotation history
async function loadQuotationHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`);
        const quotations = await response.json();
        
        const tbody = document.querySelector('#quotationTable tbody');
        tbody.innerHTML = '';
        
        quotations.forEach(quotation => {
            const row = document.createElement('tr');
            const date = new Date(quotation.date).toLocaleDateString();
            const total = quotation.total || 0;
            
            row.innerHTML = `
                <td>${quotation._id.slice(-6)}</td>
                <td>${date}</td>
                <td>${quotation.resortName}</td>
                <td>$${total.toFixed(2)}</td>
                <td>${quotation.status}</td>
                <td>
                    <button class="btn btn-view" data-id="${quotation._id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-edit" data-id="${quotation._id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-download" data-id="${quotation._id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => viewQuotation(btn.dataset.id));
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editQuotation(btn.dataset.id));
        });

        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', () => downloadQuotation(btn.dataset.id));
        });

    } catch (error) {
        console.error('Error loading quotation history:', error);
        showToast('Failed to load quotation history', 'error');
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#quotationTable tbody tr');

    rows.forEach(row => {
        const resortName = row.cells[2].textContent.toLowerCase();
        const quotationNumber = row.cells[0].textContent.toLowerCase();
        const matches = resortName.includes(searchTerm) || quotationNumber.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    });
});

// Function to print quotation
function printQuotation() {
    if (!validateQuotation(true)) return;
    
    // In a real app, you might open a print-friendly version
    window.print();
}

// Function to validate quotation
function validateQuotation(isPrint = false) {
    if (!resortSelect.value) {
        showToast('Please select a resort', 'warning');
        resortSelect.focus();
        return false;
    }
    
    if (itemsTable.children.length === 0) {
        showToast('Please add at least one item to the quotation', 'warning');
        if (!isPrint) addItemBtn.focus();
        return false;
    }
    
    return true;
}

// Function to show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Generate quotation number
async function generateQuotationNumber() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations/last`);
        const data = await response.json();
        
        let lastNumber = 0;
        if (data && data.quotationNumber) {
            const match = data.quotationNumber.match(/QUOGL(\d+)/);
            if (match) {
                lastNumber = parseInt(match[1]);
            }
        }
        
        const newNumber = lastNumber + 1;
        const formattedNumber = `QUOGL${String(newNumber).padStart(5, '0')}`;
        quotationNumber.value = formattedNumber;
    } catch (error) {
        console.error('Error generating quotation number:', error);
        // If API fails, start with QUOGL00001
        quotationNumber.value = 'QUOGL00001';
    }
}

// Function to edit quotation
async function editQuotation(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quotation');
        }
        
        const quotation = await response.json();
        
        // Hide quotation list and show form
        document.getElementById('quotationList').style.display = 'none';
        document.getElementById('quotationForm').style.display = 'block';
        
        // Store quotation ID for update
        document.getElementById('quotationId').value = quotation._id;
        
        // Fill in form with quotation data
        document.getElementById('quotationNumber').textContent = quotation.quotationNumber;
        
        // Set resort
        const resortSelect = document.getElementById('resortSelect');
        Array.from(resortSelect.options).forEach(option => {
            if (option.value === quotation.resortId) {
                option.selected = true;
                resortSelect.dispatchEvent(new Event('change'));
            }
        });
        
        // Clear existing items
        const itemsTable = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
        itemsTable.innerHTML = '';
        
        // Add items
        quotation.items.forEach(item => {
            addItemToQuotation({
                name: item.name,
                description: item.description,
                price: item.unitPrice
            }, item.quantity);
        });
        
        // Set notes
        document.getElementById('quotationNotes').value = quotation.notes || '';
        
        // Update totals
        calculateTotals();
        
        // Update save button text
        const saveBtn = document.querySelector('#saveQuotationBtn');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Quotation';
        saveBtn.onclick = () => saveQuotation(true);
        
        // Show toast
        showToast('Quotation loaded for editing', 'success');
        
    } catch (error) {
        console.error('Error editing quotation:', error);
        showToast('Failed to load quotation for editing', 'error');
    }
}

// Function to test database connection
async function testDatabaseConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-db`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('Database status:', data);
            showToast('Database connection is working', 'success');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Database test error:', error);
        showToast('Database connection error', 'error');
    }
}

// Function to clear all quotations (Development only)
async function clearAllQuotations() {
    try {
        // First test the database connection
        const testResponse = await fetch(`${API_BASE_URL}/test-db`);
        const testData = await testResponse.json();
        
        if (testResponse.ok) {
            console.log('Database status before clearing:', testData);
        } else {
            throw new Error('Database not connected');
        }

        // Try to clear the data
        const response = await fetch(`${API_BASE_URL}/quotations/clear-all`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to clear quotations');
        }
        
        const result = await response.json();
        console.log('Clear result:', result);
        
        // Test the database again to confirm it's cleared
        const afterTestResponse = await fetch(`${API_BASE_URL}/test-db`);
        const afterTestData = await afterTestResponse.json();
        console.log('Database status after clearing:', afterTestData);
        
        showToast('All quotations cleared successfully', 'success');
        
        // Reload the page to ensure everything is fresh
        window.location.reload();
    } catch (error) {
        console.error('Error clearing quotations:', error);
        showToast('Failed to clear quotations: ' + error.message, 'error');
    }
}

// Function to create a test quotation
async function createTestQuotation() {
    try {
        // Reset the form first
        resetQuotationForm();
        
        // Set resort (assuming first resort)
        const resortSelect = document.getElementById('resortSelect');
        if (resortSelect.options.length > 0) {
            resortSelect.selectedIndex = 0;
            resortSelect.dispatchEvent(new Event('change'));
        }
        
        // Add some test items
        const testItems = [
            { name: 'Test Product 1', description: 'Description 1', price: 100 },
            { name: 'Test Product 2', description: 'Description 2', price: 200 }
        ];
        
        testItems.forEach(item => {
            addItemToQuotation(item, 2); // Add 2 of each item
        });
        
        // Add notes
        document.getElementById('quotationNotes').value = 'This is a test quotation';
        
        // Save the quotation
        await saveQuotation(false);
        
        showToast('Test quotation created successfully', 'success');
    } catch (error) {
        console.error('Error creating test quotation:', error);
        showToast('Failed to create test quotation', 'error');
    }
}

// Add test buttons to the page (only in development mode)
document.addEventListener('DOMContentLoaded', () => {
    // Only add test buttons in development environment
    if (window.location.hostname === 'localhost') {
        const testButtons = `
            <div class="test-buttons" style="margin-bottom: 20px;">
                <button onclick="testDatabaseConnection()" class="btn btn-primary">
                    <i class="fas fa-database"></i> Test DB Connection
                </button>
                <button onclick="clearAllQuotations()" class="btn btn-danger">
                    <i class="fas fa-trash"></i> Clear All Quotations
                </button>
                <button onclick="createTestQuotation()" class="btn btn-info">
                    <i class="fas fa-plus"></i> Create Test Quotation
                </button>
            </div>
        `;
        
        const quotationList = document.getElementById('quotationList');
        if (quotationList) {
            quotationList.insertAdjacentHTML('afterbegin', testButtons);
        }
    }
    
    // Test database connection on page load
    testDatabaseConnection();
});

// Function to add new resort
async function addNewResort(resortData) {
    try {
        const response = await fetch(`${API_BASE_URL}/resorts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resortData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add resort');
        }

        const newResort = await response.json();
        showToast('Resort added successfully', 'success');
        
        // Refresh resorts list
        await loadResorts();
        return newResort;
    } catch (error) {
        console.error('Error adding resort:', error);
        showToast('Failed to add resort: ' + error.message, 'error');
        throw error;
    }
}

// Function to update resort
async function updateResort(id, resortData) {
    try {
        const response = await fetch(`${API_BASE_URL}/resorts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resortData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update resort');
        }

        const updatedResort = await response.json();
        showToast('Resort updated successfully', 'success');
        
        // Refresh resorts list
        await loadResorts();
        return updatedResort;
    } catch (error) {
        console.error('Error updating resort:', error);
        showToast('Failed to update resort: ' + error.message, 'error');
        throw error;
    }
}