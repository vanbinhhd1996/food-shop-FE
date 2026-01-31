// Admin Dashboard JavaScript
// File: js/pages/admin.js
// ==================== GLOBAL VARIABLES ====================
let allProducts = [];
let allOrders = [];
let allCategories = [];

// ==================== INITIALIZATION ====================

// Check admin access
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireAuth()) {
        return;
    }

    // Check if user is admin
    if (!Auth.isAdmin()) {
        Utils.showAlert('管理者権限が必要です', 'danger');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
        return;
    }

    // Display admin info
    document.getElementById('adminName').textContent = Auth.getFullName() || '管理者';
    document.getElementById('adminRole').textContent = Auth.getRole() || 'ADMIN';

    // Load dashboard data
    loadDashboardStats();
});

// ==================== NAVIGATION ====================

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.add('d-none');
    });

    // Show selected section
    document.getElementById(sectionId).classList.remove('d-none');

    // Update active menu
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Set active menu item
    const activeLink = document.querySelector(`.sidebar .nav-link[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Load section data
    switch (sectionId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'products':
            loadProducts();
            loadCategoriesForFilter();
            break;
        case 'orders':
            loadAllOrders();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'reviews':
            loadAllReviews();
            break;
    }
}

// ==================== DASHBOARD ====================

// Load dashboard stats
async function loadDashboardStats() {
    try {
        // Load all data concurrently
        const [productsRes, categoriesRes] = await Promise.all([
            API.getProducts(0, 1000),
            API.getCategories()
        ]);

        // Products count
        if (productsRes.success && productsRes.data) {
            const products = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.content || [];
            allProducts = products;
            document.getElementById('totalProducts').textContent = products.length;

            // Load low stock products (stock < 10)
            displayLowStockProducts(products.filter(p => p.stockQuantity < 10 && p.stockQuantity > 0));
        }

        // Categories count
        if (categoriesRes.success && categoriesRes.data) {
            allCategories = categoriesRes.data;
            document.getElementById('totalCategories').textContent = categoriesRes.data.length;
        }

        // Load orders
        const ordersRes = await API.getAllOrders(0, 100);

        if (ordersRes.success && ordersRes.data) {
            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.content || [];
            allOrders = orders;

            // Calculate stats
            document.getElementById('totalOrders').textContent = orders.length;

            const totalRevenue = orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);
            document.getElementById('totalRevenue').textContent = Utils.formatPrice(totalRevenue);

            // Display recent orders (last 10)
            displayRecentOrders(orders.slice(0, 10));
        }

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        Utils.handleApiError(error);
    }
}

// Display recent orders
function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrders');

    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">注文がありません</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover table-sm">
                <thead>
                    <tr>
                        <th>注文番号</th>
                        <th>日時</th>
                        <th>金額</th>
                        <th>ステータス</th>
                        <th>支払い</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>
                                <a href="${REDIRECTS.ADMIN_ORDER_DETAIL}?id=${order.id}">
                                    ${order.orderNumber}
                                </a>
                            </td>
                            <td>${Utils.formatDateTime(order.createdAt)}</td>
                            <td><strong>${Utils.formatPrice(order.totalAmount)}</strong></td>
                            <td>
                                <span class="badge ${Utils.getOrderStatusBadge(order.status)}">
                                    ${Utils.getOrderStatusText(order.status)}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'}">
                                    ${order.paymentStatus === 'PAID' ? '支払済' : '未払'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Display low stock products
function displayLowStockProducts(products) {
    const container = document.getElementById('lowStockProducts');

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">在庫が少ない商品はありません</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover table-sm">
                <thead>
                    <tr>
                        <th>商品名</th>
                        <th>在庫</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>
                                <span class="badge bg-warning">${p.stockQuantity}</span>
                            </td>
                            <td>
                                <a href="/admin-product-edit.html?id=${p.id}" class="btn btn-sm btn-primary">
                                    在庫補充
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ==================== PRODUCTS ====================

// Load products
async function loadProducts() {
    try {
        Utils.showLoading(document.getElementById('productsTable'));

        const response = await API.getProducts(0, 1000);

        if (response.success && response.data) {
            const products = Array.isArray(response.data) ? response.data : response.data.content || [];
            allProducts = products;
            displayProductsTable(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        Utils.handleApiError(error);
    }
}

// Search products
async function searchProducts() {
    try {
        const keyword = document.getElementById('productSearch').value.trim();
        const categoryId = document.getElementById('productCategoryFilter').value;
        const isActive = document.getElementById('productStatusFilter').value;

        Utils.showLoading(document.getElementById('productsTable'));

        let products = allProducts;

        // Filter by keyword
        if (keyword) {
            const response = await API.searchProducts(keyword, 0, 1000);
            if (response.success && response.data) {
                products = Array.isArray(response.data) ? response.data : response.data.content || [];
            }
        } else if (categoryId) {
            // Filter by category
            const response = await API.getProductsByCategory(categoryId, 0, 1000);
            if (response.success && response.data) {
                products = Array.isArray(response.data) ? response.data : response.data.content || [];
            }
        }

        // Filter by active status
        if (isActive !== '') {
            products = products.filter(p => p.isActive === (isActive === 'true'));
        }

        displayProductsTable(products);
    } catch (error) {
        console.error('Error searching products:', error);
        Utils.handleApiError(error);
    }
}

// Handle search on Enter key
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
}

// Display products table
function displayProductsTable(products) {
    const container = document.getElementById('productsTable');

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">商品が見つかりません</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>商品名</th>
                        <th style="width: 120px;">価格</th>
                        <th style="width: 80px;">在庫</th>
                        <th style="width: 100px;">状態</th>
                        <th style="width: 150px;" class="text-center">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.id}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${Utils.getImageUrl(p.imageUrl)}" 
                                         alt="${p.name}" 
                                         class="me-2" 
                                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"
                                         onerror="this.src='https://via.placeholder.com/40'">
                                    <div>
                                        <div>${p.name}</div>
                                        ${p.sku ? `<small class="text-muted">SKU: ${p.sku}</small>` : ''}
                                    </div>
                                </div>
                            </td>
                            <td><strong>${Utils.formatPrice(p.price)}</strong></td>
                            <td>
                                <span class="badge ${p.stockQuantity > 10 ? 'bg-success' : p.stockQuantity > 0 ? 'bg-warning' : 'bg-danger'}">
                                    ${p.stockQuantity}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${p.isActive ? 'bg-success' : 'bg-secondary'}">
                                    ${p.isActive ? '有効' : '無効'}
                                </span>
                            </td>
                            <td class="table-actions text-center">
                                <div class="action-buttons">
                                    <a href="${REDIRECTS.PRODUCT_DETAIL}?id=${p.id}" 
                                       class="btn btn-sm btn-info" 
                                       title="表示"
                                       target="_blank">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="${REDIRECTS.ADMIN_PRODUCT_EDIT}?id=${p.id}" 
                                       class="btn btn-sm btn-primary"
                                       title="編集">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button class="btn btn-sm btn-danger" 
                                            onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')"
                                            title="削除">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <p class="text-muted mb-0">合計: ${products.length}件の商品</p>
        </div>
    `;
}

// Delete product
async function deleteProduct(productId, productName) {
    if (!confirm(`商品「${productName}」を削除しますか？\nこの操作は取り消せません。`)) {
        return;
    }

    try {
        Utils.showAlert(
            '削除機能は現在開発中です。\n' +
            'Backend APIエンドポイントが必要です:\n' +
            `DELETE /api/admin/products/${productId}`,
            'info'
        );

        // When API is ready, uncomment:
        // const response = await API.deleteProduct(productId);
        // if (response.success) {
        //     Utils.showAlert('商品を削除しました', 'success');
        //     loadProducts();
        // }
    } catch (error) {
        console.error('Error deleting product:', error);
        Utils.handleApiError(error);
    }
}

// Load categories for filter
async function loadCategoriesForFilter() {
    try {
        const response = await API.getCategories();

        if (response.success && response.data) {
            const select = document.getElementById('productCategoryFilter');
            select.innerHTML = '<option value="">すべてのカテゴリー</option>' +
                response.data.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Admin Dashboard JavaScript - Part 2
// Continue from admin.js Part 1

// ==================== ORDERS ====================

// Load all orders
async function loadAllOrders() {
    try {
        Utils.showLoading(document.getElementById('ordersTable'));

        // Since backend doesn't have admin/orders endpoint, use current user's orders
        const userId = Auth.getUserId();
        const response = await API.getOrders(userId, 0, 1000);

        if (response.success && response.data) {
            const orders = Array.isArray(response.data) ? response.data : response.data.content || [];
            allOrders = orders;
            displayOrdersTable(orders);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        Utils.handleApiError(error);
    }
}

// Filter orders
function filterOrders() {
    const status = document.getElementById('orderStatusFilter').value;
    const paymentStatus = document.getElementById('orderPaymentFilter').value;

    let filteredOrders = [...allOrders];

    if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
    }

    if (paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
    }

    displayOrdersTable(filteredOrders);
}

// Display orders table
function displayOrdersTable(orders) {
    const container = document.getElementById('ordersTable');

    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">注文が見つかりません</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>注文番号</th>
                        <th>顧客名</th>
                        <th>日時</th>
                        <th style="width: 120px;">金額</th>
                        <th>ステータス</th>
                        <th>支払い</th>
                        <th style="width: 100px;" class="text-center">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>
                                <a href="/admin-order-detail.html?id=${order.id}">
                                    ${order.orderNumber}
                                </a>
                            </td>
                            <td>${order.shippingName || '-'}</td>
                            <td>${Utils.formatDateTime(order.createdAt)}</td>
                            <td><strong>${Utils.formatPrice(order.finalAmount)}</strong></td>
                            <td>
                                <span class="badge ${Utils.getOrderStatusBadge(order.status)}">
                                    ${Utils.getOrderStatusText(order.status)}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'}">
                                    ${order.paymentStatus === 'PAID' ? '支払済' : '未払'}
                                </span>
                            </td>
                            <td class="text-center">
                                <a href="/admin-order-detail.html?id=${order.id}" 
                                   class="btn btn-sm btn-primary"
                                   title="詳細">
                                    <i class="fas fa-eye"></i> 詳細
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <p class="text-muted mb-0">合計: ${orders.length}件の注文</p>
        </div>
    `;
}

// ==================== CATEGORIES ====================

// Load categories
async function loadCategories() {
    try {
        Utils.showLoading(document.getElementById('categoriesTable'));

        const response = await API.getCategories();

        if (response.success && response.data) {
            allCategories = response.data;
            displayCategoriesTable(response.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        Utils.handleApiError(error);
    }
}

// Display categories table
function displayCategoriesTable(categories) {
    const container = document.getElementById('categoriesTable');

    if (!categories || categories.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">カテゴリーがありません</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>カテゴリー名</th>
                        <th style="width: 150px;">親カテゴリー</th>
                        <th style="width: 100px;">状態</th>
                        <th style="width: 100px;" class="text-center">商品数</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(c => {
        const parent = categories.find(p => p.id === c.parentId);
        const productCount = allProducts.filter(p => p.categoryId === c.id).length;

        return `
                            <tr>
                                <td>${c.id}</td>
                                <td>
                                    <strong>${c.name}</strong>
                                    ${c.description ? `<br><small class="text-muted">${c.description}</small>` : ''}
                                </td>
                                <td>${parent ? parent.name : '-'}</td>
                                <td>
                                    <span class="badge ${c.isActive ? 'bg-success' : 'bg-secondary'}">
                                        ${c.isActive ? '有効' : '無効'}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <a href="/products.html?categoryId=${c.id}" 
                                       class="badge bg-primary text-decoration-none"
                                       target="_blank">
                                        ${productCount}
                                    </a>
                                </td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <p class="text-muted mb-0">合計: ${categories.length}件のカテゴリー</p>
        </div>
    `;
}

// ==================== REVIEWS ====================

// Load all reviews
async function loadAllReviews() {
    const container = document.getElementById('reviewsTable');

    container.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>レビュー管理について:</strong>
            <br><br>
            すべてのレビューを表示するには、Backend APIに管理者用のエンドポイントが必要です。
            <br>
            必要なAPIエンドポイント:
            <ul class="mb-0 mt-2">
                <li><code>GET /api/admin/reviews</code> - すべてのレビューを取得</li>
                <li><code>GET /api/admin/reviews?rating={rating}</code> - 評価でフィルター</li>
                <li><code>DELETE /api/admin/reviews/{id}</code> - レビューを削除</li>
            </ul>
            <br>
            現在は各商品のレビューは <code>GET /api/reviews/product/{productId}</code> で取得できますが、
            すべてのレビューを一度に取得するAPIはありません。
        </div>
    `;
}

// Filter reviews
function filterReviews() {
    Utils.showAlert('レビューフィルター機能は開発中です', 'info');
}

// ==================== UTILITY FUNCTIONS ====================

// Export functions for global use
window.showSection = showSection;
window.searchProducts = searchProducts;
window.handleSearchKeyPress = handleSearchKeyPress;
window.deleteProduct = deleteProduct;
window.loadAllOrders = loadAllOrders;
window.filterOrders = filterOrders;
window.filterReviews = filterReviews;