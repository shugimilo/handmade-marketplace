import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoriesApi";

const pastelColors = [
  "#FFD6E0",
  "#FFE5B4",
  "#FFF3B0",
  "#D4F8E8",
  "#CDE7FF",
  "#E4D1FF",
  "#FADADD",
  "#E8F8F5"
];

function getPastelColor(id) {
  return pastelColors[id % pastelColors.length];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="categories-page">
      <h1>Browse Categories</h1>

      <div className="categories-grid">
      {categories.map((category) => (
          <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="category-card"
          style={{ backgroundColor: getPastelColor(category.id) }}
          >
          {category.name}
          </Link>
      ))}
    </div>
    </div>
  );
}