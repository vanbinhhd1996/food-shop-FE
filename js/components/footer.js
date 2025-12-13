// Footer Component
const Footer = {
    /**
     * Render footer
     */
    render() {
        return `
            <footer class="footer">
                <div class="container">
                    <div class="row">
                        <!-- About Section -->
                        <div class="col-md-4 mb-4">
                            <h5>
                                <i class="fas fa-store"></i> Makase-supa
                            </h5>
                            <p class="text-muted">
                                新鮮な野菜、果物、お肉、魚など、厳選した食材をお届けします。
                                毎日の食卓を豊かにする、信頼できる食品スーパーです。
                            </p>
                            <div class="social-links">
                                <a href="#" class="me-3"><i class="fab fa-facebook fa-lg"></i></a>
                                <a href="#" class="me-3"><i class="fab fa-twitter fa-lg"></i></a>
                                <a href="#" class="me-3"><i class="fab fa-instagram fa-lg"></i></a>
                                <a href="#"><i class="fab fa-youtube fa-lg"></i></a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div class="col-md-2 mb-4">
                            <h5>クイックリンク</h5>
                            <ul class="list-unstyled">
                                <li><a href="/index.html">ホーム</a></li>
                                <li><a href="/products.html">商品一覧</a></li>
                                <li><a href="/cart.html">カート</a></li>
                                <li><a href="/orders.html">注文履歴</a></li>
                            </ul>
                        </div>

                        <!-- Categories -->
                        <div class="col-md-3 mb-4">
                            <h5>商品カテゴリー</h5>
                            <ul class="list-unstyled">
                                <li><a href="/products.html?category=野菜">野菜</a></li>
                                <li><a href="/products.html?category=果物">果物</a></li>
                                <li><a href="/products.html?category=肉">お肉</a></li>
                                <li><a href="/products.html?category=魚">魚介類</a></li>
                                <li><a href="/products.html?category=乳製品">乳製品</a></li>
                            </ul>
                        </div>

                        <!-- Contact Info -->
                        <div class="col-md-3 mb-4">
                            <h5>お問い合わせ</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <i class="fas fa-map-marker-alt me-2"></i>
                                    東京都渋谷区道玄坂1-2-3
                                </li>
                                <li class="mb-2">
                                    <i class="fas fa-phone me-2"></i>
                                    <a href="tel:0312345678">03-1234-5678</a>
                                </li>
                                <li class="mb-2">
                                    <i class="fas fa-envelope me-2"></i>
                                    <a href="mailto:info@makase-supa.jp">info@makase-supa.jp</a>
                                </li>
                                <li class="mb-2">
                                    <i class="fas fa-clock me-2"></i>
                                    営業時間: 9:00 - 21:00
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Footer Bottom -->
                    <div class="footer-bottom">
                        <div class="row">
                            <div class="col-md-6 text-md-start text-center mb-2">
                                <p class="mb-0">
                                    &copy; ${new Date().getFullYear()} Makase-supa. All rights reserved.
                                </p>
                            </div>
                            <div class="col-md-6 text-md-end text-center">
                                <a href="#" class="me-3">プライバシーポリシー</a>
                                <a href="#" class="me-3">利用規約</a>
                                <a href="#">特定商取引法</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scroll to Top Button -->
                <button 
                    id="scrollToTop" 
                    class="btn btn-primary rounded-circle position-fixed d-none" 
                    style="bottom: 20px; right: 20px; width: 50px; height: 50px; z-index: 999;"
                    onclick="Footer.scrollToTop()"
                >
                    <i class="fas fa-arrow-up"></i>
                </button>
            </footer>
        `;
    },

    /**
     * Initialize footer
     */
    init() {
        const footerContainer = document.getElementById('footer');
        if (footerContainer) {
            footerContainer.innerHTML = this.render();
        }

        // Initialize scroll to top button
        this.initScrollToTop();
    },

    /**
     * Initialize scroll to top functionality
     */
    initScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTop');
        
        if (scrollBtn) {
            // Show/hide button on scroll
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.remove('d-none');
                } else {
                    scrollBtn.classList.add('d-none');
                }
            });
        }
    },

    /**
     * Scroll to top
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Auto initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Footer.init());
} else {
    Footer.init();
}