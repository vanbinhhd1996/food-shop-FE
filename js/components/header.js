// Header Component
const Header = {
    /**
     * Render header
     */
    render() {
        const isAuthenticated = Auth.isAuthenticated();
        const username = Auth.getUsername() || 'ゲスト';
        const cartCount = Auth.getCartCount();

        return `
            <header class="header">
                <nav class="navbar navbar-expand-lg navbar-light bg-white ">
                    <div class="container">
                        <!-- Logo -->
                        <a class="navbar-brand" href="/index.html">
                            <i class="fas fa-store"></i> Makase-supa
                        </a>

                        <!-- Mobile Toggle -->
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <!-- Nav Items -->
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <!-- Left Menu -->
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/index.html">
                                        <i class="fas fa-home"></i> ホーム
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/products.html">
                                        <i class="fas fa-box"></i> 商品一覧
                                    </a>
                                </li>
                            </ul>

                            <!-- Search Form -->
                            <form class="d-flex me-3" id="searchForm" onsubmit="return Header.handleSearch(event)">
                                <input class="form-control me-2" type="search" placeholder="商品を検索..." id="searchInput" style="min-width: 250px;">
                                <button class="btn btn-outline-primary" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                            </form>

                            <!-- Right Menu -->
                            <ul class="navbar-nav">
                                <!-- Cart -->
                                <li class="nav-item">
                                    <a class="nav-link position-relative" href="/cart.html">
                                        <i class="fas fa-shopping-cart fa-lg"></i>
                                        <span class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle ${cartCount > 0 ? '' : 'd-none'}" id="cartCount">
                                            ${cartCount}
                                        </span>
                                    </a>
                                </li>

                                ${isAuthenticated ? `
                                    <!-- User Menu -->
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                                            <i class="fas fa-user"></i> ${username}
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <a class="dropdown-item" href="/profile.html">
                                                    <i class="fas fa-user-circle"></i> プロフィール
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item" href="/orders.html">
                                                    <i class="fas fa-box"></i> 注文履歴
                                                </a>
                                            </li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <a class="dropdown-item text-danger" href="#" onclick="Header.logout()">
                                                    <i class="fas fa-sign-out-alt"></i> ログアウト
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                ` : `
                                    <!-- Login/Register -->
                                    <li class="nav-item">
                                        <a class="nav-link" href="/login.html">
                                            <i class="fas fa-sign-in-alt"></i> ログイン
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/register.html">
                                            <i class="fas fa-user-plus"></i> 新規登録
                                        </a>
                                    </li>
                                `}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    },

    /**
     * Initialize header
     */
    init() {
        const headerContainer = document.getElementById('header');
        if (headerContainer) {
            headerContainer.innerHTML = this.render();
        }

        // Update cart count
        this.updateCartCount();
    },

    /**
     * Handle search
     */
    handleSearch(event) {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        const keyword = searchInput.value.trim();

        if (keyword) {
            window.location.href = `/products.html?keyword=${encodeURIComponent(keyword)}`;
        }

        return false;
    },

    /**
     * Update cart count
     */
    async updateCartCount() {
        if (!Auth.isAuthenticated()) return;

        try {
            const userId = Auth.getUserId();
            const response = await API.getCart(userId);

            if (response.success && response.data) {
                const totalItems = response.data.totalItems || 0;
                Utils.updateCartCount(totalItems);
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    },

    /**
     * Logout
     */
    logout() {
        if (confirm('ログアウトしますか？')) {
            Auth.logout();
            Utils.showAlert('ログアウトしました', 'success');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        }
    }
};

// Auto initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Header.init());
} else {
    Header.init();
}