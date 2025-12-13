// API Calls Wrapper
const API = {
    /**
     * Helper function để gọi API
     */
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ==================== AUTH APIs ====================
    
    /**
     * Đăng ký user mới
     */
    async register(userData) {
        return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    /**
     * Đăng nhập
     */
    async login(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    // ==================== PRODUCT APIs ====================
    
    /**
     * Lấy danh sách sản phẩm với phân trang
     */
    async getProducts(page = 0, size = APP_CONFIG.ITEMS_PER_PAGE) {
        return this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}?page=${page}&size=${size}`);
    },

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    async getProductById(productId) {
        return this.request(`${API_CONFIG.ENDPOINTS.PRODUCT_DETAIL}/${productId}`);
    },

    /**
     * Tìm kiếm sản phẩm theo keyword
     */
    async searchProducts(keyword, page = 0, size = APP_CONFIG.ITEMS_PER_PAGE) {
        return this.request(`${API_CONFIG.ENDPOINTS.PRODUCT_SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    },

    /**
     * Lấy sản phẩm theo category
     */
    async getProductsByCategory(categoryId, page = 0, size = APP_CONFIG.ITEMS_PER_PAGE) {
        return this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY}/${categoryId}?page=${page}&size=${size}`);
    },

    // ==================== CATEGORY APIs ====================
    
    /**
     * Lấy danh sách tất cả categories
     */
    async getCategories() {
        return this.request(API_CONFIG.ENDPOINTS.CATEGORIES);
    },

    /**
     * Lấy category tree (cấu trúc cây)
     */
    async getCategoryTree() {
        return this.request(API_CONFIG.ENDPOINTS.CATEGORY_TREE);
    },

    // ==================== CART APIs ====================
    
    /**
     * Lấy giỏ hàng của user
     */
    async getCart(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.CART}?userId=${userId}`);
    },

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    async addToCart(userId, productId, quantity) {
        return this.request(`${API_CONFIG.ENDPOINTS.CART_ITEMS}?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    },

    /**
     * Update số lượng sản phẩm trong giỏ
     */
    async updateCartItem(userId, itemId, quantity) {
        return this.request(`${API_CONFIG.ENDPOINTS.CART_ITEM}/${itemId}?userId=${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    async removeCartItem(userId, itemId) {
        return this.request(`${API_CONFIG.ENDPOINTS.CART_ITEM}/${itemId}?userId=${userId}`, {
            method: 'DELETE'
        });
    },

    /**
     * Xóa toàn bộ giỏ hàng
     */
    async clearCart(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.CART_CLEAR}?userId=${userId}`, {
            method: 'DELETE'
        });
    },

    // ==================== ORDER APIs ====================
    
    /**
     * Tạo đơn hàng mới
     */
    async createOrder(userId, orderData) {
        return this.request(`${API_CONFIG.ENDPOINTS.ORDERS}?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    /**
     * Lấy danh sách đơn hàng của user
     */
    async getOrders(userId, page = 0, size = 10) {
        return this.request(`${API_CONFIG.ENDPOINTS.ORDERS}?userId=${userId}&page=${page}&size=${size}`);
    },

    /**
     * Lấy chi tiết đơn hàng
     */
    async getOrderById(userId, orderId) {
        return this.request(`${API_CONFIG.ENDPOINTS.ORDER_DETAIL}/${orderId}?userId=${userId}`);
    },

    // ==================== REVIEW APIs ====================
    
    /**
     * Tạo review cho sản phẩm
     */
    async createReview(userId, reviewData) {
        return this.request(`${API_CONFIG.ENDPOINTS.REVIEWS}?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },

    /**
     * Lấy reviews của sản phẩm
     */
    async getProductReviews(productId, page = 0, size = 10) {
        return this.request(`${API_CONFIG.ENDPOINTS.PRODUCT_REVIEWS}/${productId}?page=${page}&size=${size}`);
    },

    // ==================== FILE APIs ====================
    
    /**
     * Upload file (image)
     */
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILE_UPLOAD}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
                // Note: Không set Content-Type cho FormData, browser sẽ tự set
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'File upload failed');
            }
            
            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },

    // ==================== USER APIs ====================
    
    /**
     * Lấy thông tin profile user
     */
    async getUserProfile(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.USER_PROFILE}?userId=${userId}`);
    },

    /**
     * Update thông tin user
     */
    async updateUserProfile(userId, userData) {
        return this.request(`${API_CONFIG.ENDPOINTS.USER_UPDATE}?userId=${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // ==================== HEALTH CHECK ====================
    
    /**
     * Kiểm tra server health
     */
    async healthCheck() {
        return this.request(API_CONFIG.ENDPOINTS.HEALTH);
    }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}