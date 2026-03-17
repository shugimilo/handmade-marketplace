import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getCurrentUserIdFromToken } from "../../utils/auth";

import "../../styles/ProductCard.css";

export default function ProductCard({ item }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentUserId = getCurrentUserIdFromToken();
  const isOwner = currentUserId === item.authorId;

  const imageUrl = item.itemImages?.[0]?.url
    ? `http://localhost:3000${item.itemImages[0].url}`
    : "/placeholder.png";

  const itemIsFavorite = isFavorite(item.id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(item.id);
  };

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__favorite-btn"
        onClick={handleToggleFavorite}
        aria-label={itemIsFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {itemIsFavorite ? "♥" : "♡"}
      </button>

      <Link to={`/items/${item.id}`} className="product-card__image-link">
        <img
          src={imageUrl}
          alt={item.name}
          className="product-card__image"
        />
      </Link>

      <div className="product-card__content">
        <Link to={`/items/${item.id}`} className="product-card__title-link">
          <h3 className="product-card__title">{item.name}</h3>
        </Link>

        <p className="product-card__price">
          {item.price} {item.currency || "RSD"}
        </p>

        <button
          className="product-card__cart-btn"
          onClick={() => addToCart(item.id, 1)}
          disabled={isOwner}
        >
          {isOwner ? "Your item" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}