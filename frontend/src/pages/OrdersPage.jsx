import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus
} from "../api/ordersApi";

export default function OrdersPage() {
  const location = useLocation();

  const [mode, setMode] = useState("buyer");
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const paymentStatus = params.get("payment");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const [buyerData, sellerData] = await Promise.all([
        getBuyerOrders(),
        getSellerOrders()
      ]);

      setBuyerOrders(buyerData.buyerOrders || []);
      setSellerOrders(sellerData.sellerOrders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update order status.");
    }
  };

  const orders = mode === "buyer" ? buyerOrders : sellerOrders;

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-page">
      <h1>Orders</h1>

      {paymentStatus === "success" && (
        <p className="success-message">Payment completed successfully.</p>
      )}

      {paymentStatus === "cancelled" && (
        <p className="error-message">Payment was cancelled.</p>
      )}

      <div className="orders-toggle">
        <button
          type="button"
          className={mode === "buyer" ? "orders-toggle__active" : ""}
          onClick={() => setMode("buyer")}
        >
          Purchases
        </button>

        <button
          type="button"
          className={mode === "seller" ? "orders-toggle__active" : ""}
          onClick={() => setMode("seller")}
        >
          Sales
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card__top">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Placed:</strong> {new Date(order.placedAt).toLocaleString()}</p>
                </div>

                <div>
                  <p><strong>Total:</strong> {order.total} RSD</p>
                  <p><strong>Payment:</strong> {order.payments?.[0]?.status || "Not paid"}</p>
                </div>
              </div>

              {order.shipTo && (
                <div className="order-card__address">
                  <h3>Shipping Address</h3>
                  <p>{order.shipTo.street} {order.shipTo.houseNo}</p>
                  <p>{order.shipTo.neighborhood}, {order.shipTo.city}</p>
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
                          <strong>
                            {mode === "buyer" ? "Seller" : "Buyer"}:
                          </strong>{" "}
                          {mode === "buyer"
                            ? item.author?.username || "Unknown seller"
                            : order.buyer?.username || "Unknown buyer"}
                        </p>
                        <p>
                          <strong>Price at purchase:</strong>{" "}
                          {orderItem.priceAtPurchase} {orderItem.currencyAtPurchase || "RSD"}
                        </p>
                        <p><strong>Quantity:</strong> {orderItem.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {mode === "seller" && (
                <div className="order-card__actions">
                  {order.status === "Paid" && (
                    <button onClick={() => handleStatusUpdate(order.id, "Shipped")}>
                      Mark as Shipped
                    </button>
                  )}

                  {order.status === "Shipped" && (
                    <button onClick={() => handleStatusUpdate(order.id, "Delivered")}>
                      Mark as Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}