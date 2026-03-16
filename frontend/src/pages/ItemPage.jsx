import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItemById, deleteItem } from "../api/itemsApi";
import { useCart } from "../context/CartContext";
import { getCurrentUserIdFromToken } from "../utils/auth";
import { useFavorites } from "../context/FavoritesContext";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentUserId = getCurrentUserIdFromToken();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getItemById(id);
        setItem(data.item || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item?.id]);

  const handleDeleteItem = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await deleteItem(item.id);
      navigate("/me");
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
    }
  };

  const handleToggleFavorite = async () => {
    const success = await toggleFavorite(item.id);

    if (!success) {
      setError("Failed to update favorite.");
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Item not found.</p>;

  const isOwner = currentUserId === item.authorId;

  const images = item.itemImages || [];
  const hasImages = images.length > 0;

  const currentImageUrl = hasImages
    ? `http://localhost:3000${images[currentImageIndex].url}`
    : "/placeholder.png";

  const itemIsFavorite = isFavorite(item.id);

  const goToPreviousImage = () => {
    if (!hasImages) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    if (!hasImages) return;

    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="item-page">
      <div className="item-page__image-wrap">
        <img
          className="item-page__image"
          src={currentImageUrl}
          alt={item.name}
        />

        {images.length > 1 && (
          <>
            <div className="item-page__image-controls">
              <button type="button" onClick={goToPreviousImage}>
                Previous
              </button>
              <span>
                {currentImageIndex + 1} / {images.length}
              </span>
              <button type="button" onClick={goToNextImage}>
                Next
              </button>
            </div>

            <div className="item-page__thumbnails">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`item-page__thumbnail-btn ${
                    index === currentImageIndex
                      ? "item-page__thumbnail-btn--active"
                      : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={`http://localhost:3000${image.url}`}
                    alt={`${item.name} ${index + 1}`}
                    className="item-page__thumbnail"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="item-page__content">
        <h1>{item.name}</h1>

        <p className="item-page__price">{item.price} RSD</p>

        <p>{item.description}</p>

        <div className="item-page__meta">
          <p>
            <strong>Pickup:</strong>{" "}
            {item.pickupAvailable ? "Yes" : "No"}
          </p>
          <p>
            <strong>Delivery:</strong>{" "}
            {item.deliveryAvailable ? "Yes" : "No"}
          </p>
        </div>

        {item.author && (
          <p>
            <strong>Seller:</strong>{" "}
            <Link
              to={
                currentUserId === item.author.id
                  ? "/me"
                  : `/users/${item.author.id}`
              }
            >
              {item.author.username || "Unknown seller"}
            </Link>
          </p>
        )}

        {item.categories?.length > 0 && (
          <div className="item-page__categories">
            <strong>Categories:</strong>
            <div className="item-page__category-list">
              {item.categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="item-page__category-badge"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="item-page__favorite-btn"
          onClick={handleToggleFavorite}
        >
          {itemIsFavorite ? "♥ Remove from favorites" : "♡ Add to favorites"}
        </button>

        <button
          className="item-page__cart-btn"
          onClick={() => addToCart(item.id, 1)}
        >
          Add to cart
        </button>

        {isOwner && (
          <div className="item-page__owner-actions">
            <Link to={`/items/${item.id}/edit`}>
              <button>Edit Item</button>
            </Link>

            <button onClick={handleDeleteItem}>
              Delete Item
            </button>
          </div>
        )}
      </div>

      {item.reviews?.length > 0 && (
        <div className="item-page__reviews">
          <h2>Reviews</h2>

          {item.reviews.map((review) => (
            <div key={review.id} className="item-page__review">
              <p>
                <strong>
                  {review.user?.username || review.user?.firstName || "User"}
                </strong>
              </p>

              {review.rating && <p>Rating: {review.rating}/5</p>}

              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}