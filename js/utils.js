// Helper Functions
const Utils = {
    /**
     * Format giá tiền
     */
    formatPrice(price) {
        return `${APP_CONFIG.CURRENCY}${Number(price).toLocaleString('ja-JP')}`;
    },

    /**
     * Format ngày tháng
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    /**
     * Format ngày giờ
     */
    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Hiển thị thông báo
     */
    showAlert(message, type = 'info') {
        // Tạo alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove sau 3 giây
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    },

    /**
     * Hiển thị loading
     */
    showLoading(element) {
        if (element) {
            element.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">読み込み中...</p>
                </div>
            `;
        }
    },

    /**
     * Ẩn loading
     */
    hideLoading() {
        const loadingElements = document.querySelectorAll('.spinner-border');
        loadingElements.forEach(el => el.parentElement.remove());
    },

    /**
     * Validate email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone (Japan format)
     */
    validatePhone(phone) {
        const re = /^[0-9-+()]{10,15}$/;
        return re.test(phone);
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get query parameter từ URL
     */
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Scroll to top
     */
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Truncate text
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Generate star rating HTML
     */
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star text-warning"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star text-warning"></i>';
        }
        
        return html;
    },

    /**
     * Get order status badge class
     */
    getOrderStatusBadge(status) {
        const badgeMap = {
            'PENDING': 'bg-warning',
            'CONFIRMED': 'bg-info',
            'PROCESSING': 'bg-primary',
            'SHIPPED': 'bg-success',
            'DELIVERED': 'bg-success',
            'CANCELLED': 'bg-danger'
        };
        return badgeMap[status] || 'bg-secondary';
    },

    /**
     * Get order status text
     */
    getOrderStatusText(status) {
        return ORDER_STATUS[status] || status;
    },

    /**
     * Get payment method text
     */
    getPaymentMethodText(method) {
        return PAYMENT_METHODS[method] || method;
    },

    /**
     * Handle API Error
     */
    handleApiError(error) {
        console.error('API Error:', error);
        
        let message = 'エラーが発生しました。';
        
        if (error.message) {
            message = error.message;
        }
        
        this.showAlert(message, 'danger');
    },

    /**
     * Confirm dialog
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Update cart count in header
     */
    updateCartCount(count) {
        const cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
            cartBadge.textContent = count;
            if (count > 0) {
                cartBadge.classList.remove('d-none');
            } else {
                cartBadge.classList.add('d-none');
            }
        }
        Auth.saveCartCount(count);
    },

    /**
     * Get image URL
     */
    getImageUrl(imageUrl) {
        if (!imageUrl) return '/images/no-image.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${API_CONFIG.BASE_URL}${imageUrl}`;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}