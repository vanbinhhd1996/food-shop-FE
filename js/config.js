// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    ENDPOINTS: {
        // Auth
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        
        // Products
        PRODUCTS: '/products',
        PRODUCT_DETAIL: '/products',
        PRODUCT_SEARCH: '/products/search',
        PRODUCTS_BY_CATEGORY: '/products/category',
        
        // Categories
        CATEGORIES: '/categories',
        CATEGORY_TREE: '/categories/tree',
        
        // Cart
        CART: '/cart',
        CART_ITEMS: '/cart/items',
        CART_ITEM: '/cart/items',
        CART_CLEAR: '/cart/clear',
        
        // Orders
        ORDERS: '/orders',
        ORDER_DETAIL: '/orders',
        
        // Reviews
        REVIEWS: '/reviews',
        PRODUCT_REVIEWS: '/reviews/product',
        
        // Files
        FILE_UPLOAD: '/files/upload',
        FILE_DOWNLOAD: '/files',
        
        // User
        USER_PROFILE: '/user/profile',
        USER_UPDATE: '/user/update',
        
        // Health
        HEALTH: '/health'
    }
};

// App Configuration
const APP_CONFIG = {
    APP_NAME: 'Makase-supa',
    VERSION: '1.0.0',
    DEFAULT_LANGUAGE: 'ja',
    ITEMS_PER_PAGE: 12,
    MAX_CART_QUANTITY: 99,
    CURRENCY: '¥',
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss'
};

// Local Storage Keys
const STORAGE_KEYS = {
    USER_ID: 'userId',
    USERNAME: 'username',
    USER_FULL_NAME: 'userFullName',
    USER_EMAIL: 'userEmail',
    USER_ROLE: 'userRole',
    CART_COUNT: 'cartCount',
    LAST_VISIT: 'lastVisit'
};

// Payment Methods
const PAYMENT_METHODS = {
    COD: '代金引換',
    BANK_TRANSFER: '銀行振込',
    CREDIT_CARD: 'クレジットカード'
};

// Order Status
const ORDER_STATUS = {
    PENDING: '注文確認中',
    CONFIRMED: '確認済み',
    PROCESSING: '処理中',
    SHIPPED: '発送済み',
    DELIVERED: '配達完了',
    CANCELLED: 'キャンセル'
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, APP_CONFIG, STORAGE_KEYS, PAYMENT_METHODS, ORDER_STATUS };
}