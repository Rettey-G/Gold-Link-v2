document.addEventListener('DOMContentLoaded', function() {
    // Base API URL - Change based on environment
    const API_BASE_URL = window.location.hostname === 'localhost' 
        ? '/api' 
        : '/.netlify/functions/server';

    // DOM Elements
    const priceListTable = document.getElementById('priceListTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const downloadBtn = document.getElementById('downloadBtn');
    const quoteModal = document.getElementById('quoteModal');
    const closeModal = document.querySelector('.close-modal');
    const quoteItems = document.getElementById('quoteItems');
    const quoteForm = document.getElementById('quoteForm');
    const editPriceModal = document.getElementById('editPriceModal');
    const editPriceForm = document.getElementById('editPriceForm');

    let products = [];
    let filteredProducts = [];

    // Fetch products from the server
    async function fetchProducts() {
        try {
            loadingIndicator.style.display = 'flex';
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            const data = await response.json();
            products = Array.isArray(data) ? data : [];
            filteredProducts = [...products];
            
            // Extract unique categories
            const categories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
            
            // Populate category filter
            categoryFilter.innerHTML = '<option value="all">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            noResults.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading products. Please try again later.</p>
            `;
            noResults.style.display = 'flex';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Render products in table
    function renderProducts(productsToRender) {
        if (productsToRender.length === 0) {
            noResults.style.display = 'flex';
            priceListTable.innerHTML = '';
            return;
        }

        noResults.style.display = 'none';
        priceListTable.innerHTML = productsToRender.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>${product.thaiName}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.unit}</td>
                <td>
                    <button class="add-to-quote-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i> Add
                    </button>
                    <button class="edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to quote and edit buttons
        document.querySelectorAll('.add-to-quote-btn').forEach(btn => {
            btn.addEventListener('click', () => addToQuote(btn.dataset.id));
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
    }

    // Filter and sort products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sortValue = sortBy.value;

        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.thaiName.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' ? true : product.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sort products
        filteredProducts.sort((a, b) => {
            switch(sortValue) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        renderProducts(filteredProducts);
    }

    // Event listeners
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', filterProducts);
    editPriceForm.addEventListener('submit', saveEditedProduct);

    // Quote modal functionality
    let quoteItemsArray = [];

    function addToQuote(productId) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            quoteItemsArray.push(product);
            updateQuoteModal();
            quoteModal.style.display = 'block';
        }
    }

    function updateQuoteModal() {
        quoteItems.innerHTML = quoteItemsArray.map(item => `
            <div class="quote-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)} / ${item.unit}</span>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Modal controls
    closeModal.addEventListener('click', () => {
        quoteModal.style.display = 'none';
        editPriceModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === quoteModal || e.target === editPriceModal) {
            quoteModal.style.display = 'none';
            editPriceModal.style.display = 'none';
        }
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        // Implement download functionality here
        alert('Download functionality will be implemented soon!');
    });

    // Open edit modal
    function openEditModal(productId) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            document.getElementById('editProductId').value = product.id;
            document.getElementById('editProductName').textContent = product.name;
            document.getElementById('editCurrentPrice').textContent = `$${product.price.toFixed(2)}`;
            document.getElementById('editNewPrice').value = product.price;
            document.getElementById('editUnit').value = product.unit;
            document.getElementById('editCategory').value = product.category;
            editPriceModal.style.display = 'block';
        }
    }

    // Save edited product
    async function saveEditedProduct(event) {
        event.preventDefault();
        
        const productId = document.getElementById('editProductId').value;
        const newPrice = parseFloat(document.getElementById('editNewPrice').value);
        const newUnit = document.getElementById('editUnit').value;
        const newCategory = document.getElementById('editCategory').value;

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: newPrice,
                    unit: newUnit,
                    category: newCategory
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            // Update the product in our local array
            const productIndex = products.findIndex(p => p.id === parseInt(productId));
            if (productIndex !== -1) {
                products[productIndex].price = newPrice;
                products[productIndex].unit = newUnit;
                products[productIndex].category = newCategory;
                filteredProducts = [...products];
                renderProducts(filteredProducts);
            }

            editPriceModal.style.display = 'none';
            alert('Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    }

    // Initialize
    fetchProducts();
});