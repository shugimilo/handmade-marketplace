import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemById } from "../api/itemsApi";
import { useCart } from "../context/CartContext";

export default function ItemPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading item...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Item not found.</p>;

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

        {item.user && (
          <p>
            <strong>Seller:</strong>{" "}
            {item.user.username || item.user.firstName || "Unknown seller"}
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