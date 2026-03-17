import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoriesApi";

import "../styles/CategoriesPage.css";
import formatCategoryName from "../utils/categoryName";

function getCategoryCardClass(index) {
  const variants = [
    "category-card--cream",
    "category-card--yellow",
    "category-card--blue",
    "category-card--orange"
  ];

  return variants[index % variants.length];
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
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className={`category-card ${getCategoryCardClass(index)}`}
          >
            {formatCategoryName(category.name)}
          </Link>
        ))}
    </div>
    </div>
  );
}