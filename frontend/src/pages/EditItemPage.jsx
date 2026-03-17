import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/categoriesApi";
import {
  getItemById,
  updateItem,
  uploadItemImage,
  deleteItemImage
} from "../api/itemsApi";

import "../styles/EditItemPage.css"
import formatCategoryName from "../utils/categoryName";

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "rsd",
    pickupAvailable: false,
    deliveryAvailable: false,
    categories: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentImageCount = item?.itemImages?.length || 0;
  const remainingSlots = Math.max(0, 5 - currentImageCount);

  const loadData = async () => {
    try {
      setLoading(true);

      const [categoriesData, itemData] = await Promise.all([
        getCategories(),
        getItemById(id)
      ]);

      const loadedCategories = categoriesData.categories || categoriesData;
      const loadedItem = itemData.item || itemData;

      setCategories(loadedCategories);
      setItem(loadedItem);

      setFormData({
        name: loadedItem.name || "",
        description: loadedItem.description || "",
        price: loadedItem.price || "",
        currency: loadedItem.currency || "rsd",
        pickupAvailable: !!loadedItem.pickupAvailable,
        deliveryAvailable: !!loadedItem.deliveryAvailable,
        categories: loadedItem.categories?.map((c) => c.id) || []
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load item.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(categoryId);

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((id) => id !== categoryId)
          : [...prev.categories, categoryId]
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = item?.itemImages?.length || 0;
    const remainingSlots = Math.max(0, 5 - currentImageCount);

    const limitedFiles = files.slice(0, remainingSlots);
    setSelectedImages(limitedFiles);

    if (files.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image(s).`);
    } else {
      setError("");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteItemImage(id, imageId);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      await updateItem(id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        currency: formData.currency,
        pickupAvailable: formData.pickupAvailable,
        deliveryAvailable: formData.deliveryAvailable,
        categories: formData.categories
      });

      for (const image of selectedImages) {
        await uploadItemImage(id, image);
      }

      setSuccess("Item updated successfully.");
      navigate(`/items/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (!item) return <p>Item not found.</p>;

  console.log("ITEM OBJECT:", item);
  console.log("ITEM IMAGES:", item.itemImages);
  console.log("IMAGE COUNT:", item?.itemImages?.length);

  return (
    <div className="create-item-page">
      <h1>Edit Item</h1>

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

        <input
          type="text"
          name="currency"
          placeholder="Currency"
          value={formData.currency}
          onChange={handleChange}
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
          <h3>Current Images</h3>
          <p>{currentImageCount} / 5 images used</p>

          <div className="edit-item-images">
            {item.itemImages?.length > 0 ? (
              item.itemImages.map((image) => (
                <div key={image.id} className="edit-item-image-card">
                  <img
                    src={`http://localhost:3000${image.url}`}
                    alt="Item"
                    className="edit-item-image-card__img"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Delete image
                  </button>
                </div>
              ))
            ) : (
              <p>No images yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3>Add New Images</h3>
          <p>You can upload {remainingSlots} more image{ remainingSlots != 1 ? "s" : ""}.</p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={remainingSlots === 0}
          />

          {remainingSlots === 0 && (
            <p>You have reached the maximum of 5 images.</p>
          )}

          {selectedImages.length > 0 && (
            <ul>
              {selectedImages.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}