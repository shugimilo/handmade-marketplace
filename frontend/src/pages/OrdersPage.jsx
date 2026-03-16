import { useEffect, useState } from "react";
import { getBuyerOrders } from "../api/ordersApi";
import { useLocation } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentStatus = params.get("payment");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getBuyerOrders();
        setOrders(data.buyerOrders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {paymentStatus === "success" && (
        <p className="success-message">Payment completed successfully.</p>
      )}

      {paymentStatus === "cancelled" && (
        <p className="error-message">Payment was cancelled.</p>
      )}

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card__top">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Placed:</strong>{" "}
                    {new Date(order.placedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Total:</strong> {order.total} RSD
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.payments?.[0]?.status || "Not paid"}
                  </p>
                </div>
              </div>

              {order.shipTo && (
                <div className="order-card__address">
                  <h3>Shipping Address</h3>
                  <p>
                    {order.shipTo.street} {order.shipTo.houseNo}
                  </p>
                  <p>
                    {order.shipTo.neighborhood}, {order.shipTo.city}
                  </p>
                </div>
              )}

              <div className="order-card__items">
                <h3>Items</h3>

                {order.orderItems.map((orderItem) => {
                  const item = orderItem.item;
                  const imageUrl = item.itemImages?.[0]?.url
                    ? `http://localhost:3000${item.itemImages[0].url}`
                    : "/placeholder.png";

                  return (
                    <div key={orderItem.id} className="order-item">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="order-item__image"
                      />

                      <div className="order-item__info">
                        <h4>{item.name}</h4>

                        <p>
                          <strong>Seller:</strong>{" "}
                          {item.author?.username || "Unknown seller"}
                        </p>

                        <p>
                          <strong>Price at purchase:</strong>{" "}
                          {orderItem.priceAtPurchase}{" "}
                          {orderItem.currencyAtPurchase || "RSD"}
                        </p>

                        <p>
                          <strong>Quantity:</strong> {orderItem.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}