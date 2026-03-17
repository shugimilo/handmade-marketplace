import { useEffect, useState } from "react";
import {
  getAdminUsers,
  deleteAdminUser,
  deleteAdminReview,
  getAdminItems,
  deleteAdminItem,
  getAdminOrders,
  getAdminReviews
} from "../api/adminApi";
import { isCurrentUserAdmin } from "../utils/admin";

import "../styles/AdminPage.css";

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const isAdmin = isCurrentUserAdmin();

  const loadTabData = async () => {
    try {
      setLoading(true);
      setError("");

      if (tab === "users") {
        const data = await getAdminUsers(page, 20);
        setUsers(data.users || data.items || []);
        setPagination(data.pagination || null);
      }

      if (tab === "items") {
        const data = await getAdminItems(page, 20);
        setItems(data.items || []);
        setPagination(data.pagination || null);
      }

      if (tab === "orders") {
        const data = await getAdminOrders(page, 20);
        setOrders(data.orders || []);
        setPagination(data.pagination || null);
      }

      if (tab === "reviews") {
        const data = await getAdminReviews(page, 20);
        setReviews(data.reviews || []);
        setPagination(data.pagination || null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    loadTabData();
  }, [tab, page]);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      await deleteAdminUser(userId);
      await loadTabData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    try {
      await deleteAdminItem(itemId);
      await loadTabData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete item.");
    }
  };

    const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;

    try {
      await deleteAdminReview(reviewId);
      await loadTabData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (!isAdmin) {
    return <p>Access denied.</p>;
  }

  if (loading) return <p>Loading admin panel...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={tab === "users" ? "admin-tabs__active" : ""}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={tab === "items" ? "admin-tabs__active" : ""}
          onClick={() => setTab("items")}
        >
          Items
        </button>
        <button
          className={tab === "orders" ? "admin-tabs__active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={tab === "reviews" ? "admin-tabs__active" : ""}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {tab === "users" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "-"}</td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "items" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Author</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price} {item.currency || "RSD"}</td>
                  <td>{item.author?.username || item.authorId || "-"}</td>
                  <td>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>{order.total} RSD</td>
                  <td>{new Date(order.placedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item ID</th>
                <th>Reviewer ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.itemId}</td>
                  <td>{review.reviewerId}</td>
                  <td>{review.rating}/5</td>
                  <td>{review.comment || "-"}</td>
                  <td>
                    {review.reviewedOn
                      ? new Date(review.reviewedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}