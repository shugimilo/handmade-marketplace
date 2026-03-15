import "../Home.css"

export default function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="container hero-content">
          <h1>
            <i>Where Every Stitch <b>Tells a Story</b></i>
          </h1>

          <p>
            Discover unique handcrafted treasures made with passion,
            purpose, and a personal touch that no machine can replicate.
          </p>

          <div className="hero-buttons">
            <button>Explore Collection</button>
            <button className="secondary">Meet the Makers</button>
          </div>
        </div>
      </section>


      <section className="categories container">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          <div className="category-card">Knitting</div>
          <div className="category-card">Bags</div>
          <div className="category-card">Accessories</div>
        </div>
      </section>


      <section className="featured container">
        <h2>Featured Items</h2>

        <div className="product-grid">
          {/* later: ProductCard components */}
          <div className="product-card">Item</div>
          <div className="product-card">Item</div>
          <div className="product-card">Item</div>
        </div>
      </section>


      <section className="discover-more container">
        <button className="discover-button">
          Discover More Treasures
        </button>
      </section>

    </div>
  )
}