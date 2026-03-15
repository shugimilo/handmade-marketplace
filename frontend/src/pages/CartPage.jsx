import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    loading,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    emptyCart
  } = useCart();

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cart || !cart.cart) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const cartData = cart.cart;
  const total = cart.total;

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1>Your Cart</h1>

        {cartData.cartItems.length > 0 && (
          <button onClick={emptyCart}>Empty cart</button>
        )}
      </div>

      {cartData.cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartData.cartItems.map((cartItem) => {
              const item = cartItem.item;
              const imageUrl = item.images?.[0]?.url
                ? `http://localhost:3000${item.images[0].url}`
                : "/placeholder.png";

              return (
                <div key={cartItem.id} className="cart-item">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="cart-item__image"
                  />

                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <p>Price: {item.price} RSD</p>
                    <p>Subtotal: {item.price * cartItem.quantity} RSD</p>

                    <div className="cart-item__controls">
                      <button onClick={() => decreaseQuantity(cartItem.id)}>
                        -
                      </button>

                      <span>{cartItem.quantity}</span>

                      <button onClick={() => addToCart(item.id, 1)}>
                        +
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(cartItem.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <h2>Total: {total} RSD</h2>
        </>
      )}
    </div>
  );
}