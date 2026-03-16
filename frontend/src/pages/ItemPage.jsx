import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItemById, deleteItem } from "../api/itemsApi";
import { useCart } from "../context/CartContext";
import { getCurrentUserIdFromToken } from "../utils/auth";

export default function ItemPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const navigate = useNavigate();

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

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
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

  const currentUserId = getCurrentUserIdFromToken();

  if (loading) return <p>Loading item...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Item not found.</p>;

  const isOwner = currentUserId === item.authorId;

  const firstImage = item.itemImages?.[0]?.url
    ? `http://localhost:3000${item.itemImages[0].url}`
    : "/placeholder.png";

  return (
    <div className="item-page">
      <div className="item-page__image-wrap">
        <img
          className="item-page__image"
          src={firstImage}
          alt={item.name}
        />
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
                <span
                  key={category.id}
                  className="item-page__category-badge"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

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