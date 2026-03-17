import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categoriesApi";
import { createItem, uploadItemImage } from "../api/itemsApi";

import "../styles/CreateItemPage.css";
import formatCategoryName from "../utils/categoryName";

export default function CreateItemPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    pickupAvailable: false,
    deliveryAvailable: false,
    categories: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data.categories || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(categoryId);

      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((id) => id !== categoryId)
          : [...prev.categories, categoryId]
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      const itemPayload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        pickupAvailable: formData.pickupAvailable,
        deliveryAvailable: formData.deliveryAvailable,
        categories: formData.categories
      };

      const created = await createItem(itemPayload);
      const item = created.item;

      if (!item?.id) {
        throw new Error("Item was not created properly.");
      }

      for (const image of selectedImages) {
        await uploadItemImage(item.id, image);
      }

      setSuccess("Item created successfully.");
      navigate(`/items/${item.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to create item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="create-item-page">
      <h1>Create New Item</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="create-item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <div className="create-item-checkboxes">
          <label>
            <input
              type="checkbox"
              name="pickupAvailable"
              checked={formData.pickupAvailable}
              onChange={handleChange}
            />
            Pickup available
          </label>

          <label>
            <input
              type="checkbox"
              name="deliveryAvailable"
              checked={formData.deliveryAvailable}
              onChange={handleChange}
            />
            Delivery available
          </label>
        </div>

        <div>
          <h3>Categories</h3>
          <div className="create-item-categories">
            {categories.map((category) => (
              <label key={category.id} className="create-item-category">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                {formatCategoryName(category.name)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3>Images</h3>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
          />
          <p>Up to 5 images.</p>

          {selectedImages.length > 0 && (
            <ul>
              {selectedImages.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Item"}
        </button>
      </form>
    </div>
  );
}