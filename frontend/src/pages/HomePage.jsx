import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getItems } from "../api/itemsApi";
import { getCategories } from "../api/categoriesApi";
import ProductCard from "../components/products/ProductCard";

import "../styles/HomePage.css";
import formatCategoryName from "../utils/categoryName";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const categoryCarouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [itemsData, categoriesData] = await Promise.all([
          getItems(page, limit),
          getCategories()
        ]);

        setItems(itemsData.items || []);
        setPagination(itemsData.pagination || null);
        setCategories(categoriesData.categories || categoriesData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load home page data.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [page]);

  const goToPage = (newPage) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryPillClass = (index) => {
    const variants = [
      "category-pill--cream",
      "category-pill--yellow",
      "category-pill--blue",
      "category-pill--orange"
    ];

    return `category-pill ${variants[index % variants.length]}`;
  };

  const handleCarouselMouseDown = (e) => {
    const carousel = categoryCarouselRef.current;
    if (!carousel) return;

    isDraggingRef.current = true;
    carousel.classList.add("category-carousel--dragging");

    startXRef.current = e.pageX - carousel.offsetLeft;
    scrollLeftRef.current = carousel.scrollLeft;
  };

  const handleCarouselMouseLeave = () => {
    const carousel = categoryCarouselRef.current;
    if (!carousel) return;

    isDraggingRef.current = false;
    carousel.classList.remove("category-carousel--dragging");
  };

  const handleCarouselMouseUp = () => {
    const carousel = categoryCarouselRef.current;
    if (!carousel) return;

    isDraggingRef.current = false;
    carousel.classList.remove("category-carousel--dragging");
  };

  const handleCarouselMouseMove = (e) => {
    const carousel = categoryCarouselRef.current;
    if (!carousel || !isDraggingRef.current) return;

    e.preventDefault();

    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    carousel.scrollLeft = scrollLeftRef.current - walk;
  };

  if (loading) return <p className="home-status">Loading items...</p>;
  if (error) return <p className="home-status">{error}</p>;

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">Handmade marketplace</p>
          <h1>Discover objects with character.</h1>
          <p className="home-hero__description">
            Thoughtful, handmade pieces created by independent makers.
            Explore fresh arrivals, timeless crafts, and items that bring
            warmth into everyday life.
          </p>

          <div className="home-hero__actions">
            <a
              href="#newest-items"
              className="home-hero__button home-hero__button--primary"
            >
              Shop Newest
            </a>
            <a
              href="#categories"
              className="home-hero__button home-hero__button--secondary"
            >
              Browse Categories
            </a>
          </div>
        </div>

        <div className="home-hero__image-wrapper">
          <img
            src="/13770101203d368db19299ab6da69a70.jpg"
            alt="Featured handmade products"
            className="home-hero__image"
          />
        </div>
      </section>

      <section className="home-categories" id="categories">
        <div className="section-heading">
          <p className="section-heading__eyebrow">Explore</p>
          <h2>Shop by category</h2>
          <p className="section-heading__description">
            Start with what inspires you and discover handmade items worth keeping.
          </p>
        </div>

        <div
          ref={categoryCarouselRef}
          className="category-carousel"
          onMouseDown={handleCarouselMouseDown}
          onMouseLeave={handleCarouselMouseLeave}
          onMouseUp={handleCarouselMouseUp}
          onMouseMove={handleCarouselMouseMove}
        >
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={getCategoryPillClass(index)}
              >
                {formatCategoryName(category.name)}
              </Link>
            ))
          ) : (
            <p className="home-empty">No categories found.</p>
          )}
        </div>
      </section>

      <section className="home-products" id="newest-items">
        <div className="section-heading">
          <p className="section-heading__eyebrow">Latest arrivals</p>
          <h2>Newest Items</h2>
          <p className="section-heading__description">
            Fresh creations from the community.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="home-empty">No items found.</p>
        ) : (
          <div className="products-grid">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}