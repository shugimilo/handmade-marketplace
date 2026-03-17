import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItemById, deleteItem } from "../api/itemsApi";
import { useCart } from "../context/CartContext";
import { getCurrentUserIdFromToken } from "../utils/auth";
import { useFavorites } from "../context/FavoritesContext";
import { createReview } from "../api/reviewsApi";
import { useAuth } from "../context/AuthContext";

import "../styles/ItemPage.css";
import formatCategoryName from "../utils/categoryName";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const { isAuthenticated } = useAuth();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

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

  const handleReviewChange = (e) => {
    const { name, value } = e.target;

    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setReviewSubmitting(true);

      await createReview(item.id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      const data = await getItemById(id);
      setItem(data.item || data);

      setReviewForm({
        rating: 5,
        comment: ""
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <p className="item-page__status">Loading item...</p>;
  if (error) return <p className="item-page__status">{error}</p>;
  if (!item) return <p className="item-page__status">Item not found.</p>;

  const isOwner = currentUserId === item.authorId;

  const images = item.itemImages || [];
  const hasImages = images.length > 0;

  const currentImageUrl = hasImages
    ? `http://localhost:3000${images[currentImageIndex].url}`
    : "/placeholder.png";

  const itemIsFavorite = isFavorite(item.id);

  const averageRating =
    item.reviews && item.reviews.length > 0
      ? (
          item.reviews.reduce((sum, r) => sum + r.rating, 0) /
          item.reviews.length
        ).toFixed(1)
      : null;

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
              <button
                type="button"
                className="item-page__carousel-btn"
                onClick={goToPreviousImage}
              >
                Previous
              </button>

              <span className="item-page__image-counter">
                {currentImageIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                className="item-page__carousel-btn"
                onClick={goToNextImage}
              >
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
        <h1 className="item-page__title">{item.name}</h1>

        {averageRating && (
          <div className="item-page__rating-summary">
            <span className="item-page__rating-stars">
              {"★".repeat(Math.floor(averageRating))}
              {"☆".repeat(5 - Math.floor(averageRating))}
            </span>

            <span className="item-page__rating-number">
              {averageRating} / 5
            </span>

            <span className="item-page__rating-count">
              ({item.reviews.length} review{item.reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}

        <p className="item-page__price">{item.price} RSD</p>

        <p className="item-page__description">{item.description}</p>

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
          <p className="item-page__seller">
            <strong>Seller:</strong>{" "}
            <Link
              className="item-page__seller-link"
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
                  {formatCategoryName(category.name)}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="item-page__actions">
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
            disabled={isOwner}
          >
            {isOwner ? "You own this item" : "Add to cart"}
          </button>
        </div>

        {isOwner && (
          <div className="item-page__owner-actions">
            <Link to={`/items/${item.id}/edit`}>
              <button type="button" className="item-page__owner-btn">
                Edit Item
              </button>
            </Link>

            <button
              type="button"
              className="item-page__owner-btn item-page__owner-btn--danger"
              onClick={handleDeleteItem}
            >
              Delete Item
            </button>
          </div>
        )}
      </div>

      <div className="item-page__reviews">
        <h2 className="item-page__reviews-title">Reviews</h2>

        {isAuthenticated && !isOwner && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label className="review-form__label">
              Rating
              <select
                className="review-form__select"
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </label>

            <textarea
              className="review-form__textarea"
              name="comment"
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={handleReviewChange}
              rows={4}
            />

            <button
              className="review-form__submit"
              type="submit"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {item.reviews?.length > 0 ? (
          item.reviews.map((review) => (
            <div key={review.id} className="item-page__review">
              <div className="item-page__review-header">
                <img
                  className="item-page__review-avatar"
                  src={
                    review.reviewer?.pfpUrl
                      ? `http://localhost:3000${review.reviewer.pfpUrl}`
                      : "/placeholder.png"
                  }
                  alt="User avatar"
                />

                <div className="item-page__review-meta">
                  <strong className="item-page__review-author">
                    <Link
                      className="item-page__review-author-link"
                      to={
                        currentUserId === review.reviewer?.id
                          ? "/me"
                          : `/users/${review.reviewer?.id}`
                      }
                    >
                      {review.reviewer?.username || "User"}
                    </Link>
                  </strong>

                  <p className="item-page__review-date">
                    {new Date(review.reviewedOn).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="item-page__review-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>

              {review.comment && (
                <p className="item-page__review-comment">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="item-page__no-reviews">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}