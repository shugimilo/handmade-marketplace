import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getShippingAddresses, createShippingAddress } from "../api/shippingAddressesApi";
import { createOrder } from "../api/ordersApi";
import { createPayment } from "../api/paymentsApi";

export default function CheckoutPage() {
  const { cart, loading: cartLoading, fetchCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [newAddress, setNewAddress] = useState({
    street: "",
    houseNo: "",
    neighborhood: "",
    city: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getShippingAddresses();
        const loadedAddresses = data.shippingAddresses || [];
        setAddresses(loadedAddresses);

        if (loadedAddresses.length > 0) {
          setSelectedAddressId(String(loadedAddresses[0].id));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();

    try {
      const data = await createShippingAddress(newAddress);
      const created = data.shippingAddress;

      if (!created) return;

      const updatedAddresses = [...addresses, created];
      setAddresses(updatedAddresses);
      setSelectedAddressId(String(created.id));

      setNewAddress({
        street: "",
        houseNo: "",
        neighborhood: "",
        city: ""
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create address.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const orderData = await createOrder(Number(selectedAddressId));
      const createdOrders = orderData.orders || [];

      if (createdOrders.length === 0) {
        throw new Error("No orders were created.");
      }

      const orderIds = createdOrders.map((order) => order.id);
      const paymentData = await createPayment(orderIds);

      await fetchCart();

      if (paymentData.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading || loading) return <p>Loading checkout...</p>;

  const cartData = cart?.cart;
  const total = cart?.total || 0;

  if (!cartData || cartData.cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <p className="auth-error">{error}</p>}

      <div className="checkout-layout">
        <div className="checkout-section">
          <h2>Shipping Address</h2>

          {addresses.length > 0 ? (
            <div className="checkout-address-list">
              {addresses.map((address) => (
                <label key={address.id} className="checkout-address-card">
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id}
                    checked={String(address.id) === selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  />
                  <div>
                    <p>{address.street} {address.houseNo}</p>
                    <p>{address.neighborhood}, {address.city}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p>No saved addresses yet.</p>
          )}

          <form className="checkout-address-form" onSubmit={handleCreateAddress}>
            <h3>Add New Address</h3>

            <input
              type="text"
              name="street"
              placeholder="Street"
              value={newAddress.street}
              onChange={handleAddressChange}
              required
            />

            <input
              type="text"
              name="houseNo"
              placeholder="House number"
              value={newAddress.houseNo}
              onChange={handleAddressChange}
              required
            />

            <input
              type="text"
              name="neighborhood"
              placeholder="Neighborhood"
              value={newAddress.neighborhood}
              onChange={handleAddressChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleAddressChange}
              required
            />

            <button type="submit">Save address</button>
          </form>
        </div>

        <div className="checkout-section">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartData.cartItems.map((cartItem) => (
              <div key={cartItem.id} className="checkout-item">
                <p>{cartItem.item.name}</p>
                <p>{cartItem.quantity} × {cartItem.item.price} RSD</p>
              </div>
            ))}
          </div>

          <h3>Total: {total} RSD</h3>

          <button onClick={handleCheckout} disabled={submitting}>
            {submitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}