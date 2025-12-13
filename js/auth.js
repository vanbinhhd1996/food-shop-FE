// Authentication utilities
const Auth = {
    /**
     * Lưu thông tin user sau khi đăng nhập
     */
    saveUser(userData) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, userData.userId);
        localStorage.setItem(STORAGE_KEYS.USERNAME, userData.username);
        localStorage.setItem(STORAGE_KEYS.USER_FULL_NAME, userData.fullName);
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, userData.role);
        localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
    },

    /**
     * Lấy userId hiện tại
     */
    getUserId() {
        return localStorage.getItem(STORAGE_KEYS.USER_ID);
    },

    /**
     * Lấy username hiện tại
     */
    getUsername() {
        return localStorage.getItem(STORAGE_KEYS.USERNAME);
    },

    /**
     * Lấy full name hiện tại
     */
    getFullName() {
        return localStorage.getItem(STORAGE_KEYS.USER_FULL_NAME);
    },

    /**
     * Lấy email hiện tại
     */
    getEmail() {
        return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    },

    /**
     * Lấy role hiện tại
     */
    getRole() {
        return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    },

    /**
     * Lấy tất cả thông tin user
     */
    getCurrentUser() {
        return {
            userId: this.getUserId(),
            username: this.getUsername(),
            fullName: this.getFullName(),
            email: this.getEmail(),
            role: this.getRole()
        };
    },

    /**
     * Kiểm tra user đã đăng nhập chưa
     */
    isAuthenticated() {
        return !!this.getUserId();
    },

    /**
     * Kiểm tra user có phải admin không
     */
    isAdmin() {
        return this.getRole() === 'ADMIN';
    },

    /**
     * Đăng xuất
     */
    logout() {
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        localStorage.removeItem(STORAGE_KEYS.USERNAME);
        localStorage.removeItem(STORAGE_KEYS.USER_FULL_NAME);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.CART_COUNT);
    },

    /**
     * Xóa toàn bộ dữ liệu
     */
    clearAll() {
        localStorage.clear();
    },

    /**
     * Redirect đến trang login nếu chưa đăng nhập
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    },

    /**
     * Redirect đến trang home nếu đã đăng nhập
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = '/index.html';
            return true;
        }
        return false;
    },

    /**
     * Lưu số lượng sản phẩm trong giỏ hàng
     */
    saveCartCount(count) {
        localStorage.setItem(STORAGE_KEYS.CART_COUNT, count);
    },

    /**
     * Lấy số lượng sản phẩm trong giỏ hàng
     */
    getCartCount() {
        return parseInt(localStorage.getItem(STORAGE_KEYS.CART_COUNT)) || 0;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}