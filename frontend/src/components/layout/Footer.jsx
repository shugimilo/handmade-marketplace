export default function Footer() {
  return (
    <footer className="footer">
        <div className="container">
            <div className="footer-newsletter">
                <h3>Subscribe to our newsletter</h3>
                <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
                </form>
            </div>

            <div className="footer-info">
                <div className="footer-brand">
                <h2>MyShop</h2>
                <p>
                    Handmade items crafted with care. Discover unique products
                    from passionate creators.
                </p>
                </div>

                <div className="footer-links">
                <a href="/shop">Shop</a>
                <a href="/categories">Categories</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                </div>
            </div>
        </div>
    </footer>
  )
}