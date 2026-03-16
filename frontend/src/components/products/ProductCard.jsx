import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ item }) {
  const { addToCart } = useCart();

  const imageUrl = item.itemImages?.[0]?.url
    ? `http://localhost:3000${item.itemImages[0].url}`
    : "/placeholder.png";

  return (
    <div className="product-card">
      <Link to={`/items/${item.id}`}>
        <img src={imageUrl} alt={item.name} />
      </Link>

      <h3>{item.name}</h3>
      <p>{item.price} RSD</p>

      <button onClick={() => {
        console.log("Adding item: ", item.id)
        addToCart(item.id, 1)
        }}>
        Add to cart
      </button>
    </div>
  );
}