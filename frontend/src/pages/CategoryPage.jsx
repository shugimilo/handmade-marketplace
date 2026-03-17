import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getCategoryItems } from "../api/categoriesApi";
import ProductCard from "../components/products/ProductCard";

import "../styles/CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "newest";
  const limit = 12;

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategoryItems(id, page, limit, sort);

        setCategory(data.category);
        setItems(data.items || []);
        setPagination(data.pagination || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load category.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, page, sort]);

  const handleSortChange = (e) => {
    setSearchParams({
      page: "1",
      sort: e.target.value
    });
  };

  const goToPage = (newPage) => {
    setSearchParams({
      page: String(newPage),
      sort
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="category-page__status">Loading category...</p>;
  if (error) return <p className="category-page__status">{error}</p>;
  if (!category) return <p className="category-page__status">Category not found.</p>;

  return (
    <div className="category-page">
      <div className="category-page__top">
        <div>
          <h1 className="category-page__title">#{category.name}</h1>

          {pagination && (
            <h3 className="category-page__count">
              {pagination.totalItems} items
            </h3>
          )}
        </div>

        <div className="category-page__sort">
          <label htmlFor="category-sort">Sort by</label>
          <select
            id="category-sort"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="category-page__status">No items in this category yet.</p>
      ) : (
        <div className="category-page__grid">
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
    </div>
  );
}