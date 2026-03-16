import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getCurrentUserIdFromToken } from "../../utils/auth";

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
    <div className="product-card">
      <button
        type="button"
        className="product-card__favorite-btn"
        onClick={handleToggleFavorite}
      >
        {itemIsFavorite ? "♥" : "♡"}
      </button>

      <Link to={`/items/${item.id}`}>
        <img src={imageUrl ? imageUrl : '/placeholder.png'} alt={item.name} />
      </Link>

      <h3>{item.name}</h3>

      <p>{item.price} {item.currency || "RSD"}</p>

      <button
        onClick={() => addToCart(item.id, 1)}
        disabled={isOwner}
      >
        {isOwner ? "Your item" : "Add to cart"}
      </button>
    </div>
  );
}