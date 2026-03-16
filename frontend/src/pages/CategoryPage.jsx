import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryItems } from "../api/categoriesApi";
import ProductCard from "../components/products/ProductCard";

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
    try {
        setLoading(true);

        const data = await getCategoryItems(id);

        setCategory(data.category);
        setItems(data.items || []);
        setPagination(data.pagination);

    } catch (err) {
        console.error(err);
        setError("Failed to load category.");
    } finally {
        setLoading(false);
    }
    };

    loadCategory();
  }, [id]);

  if (loading) return <p>Loading category...</p>;
  if (error) return <p>{error}</p>;
  if (!category) return <p>Category not found.</p>;

  return (
    <div className="category-page">

      <h1 className="category-page__title">{category?.name}</h1>

      {pagination && (
      <h3 className="category-page__count">
          {pagination.totalItems} items
      </h3>
      )}

      {items.length === 0 ? (
        <p>No items in this category yet.</p>
      ) : (
        <div className="category-page__grid">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}