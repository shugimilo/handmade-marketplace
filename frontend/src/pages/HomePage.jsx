import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getItems } from "../api/itemsApi";
import ProductCard from "../components/products/ProductCard";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getItems(page, limit);

        setItems(data.items || []);
        setPagination(data.pagination || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [page]);

  const goToPage = (newPage) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1>Newest Items</h1>
        <p>Discover the latest handmade products.</p>
      </div>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="products-grid">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
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