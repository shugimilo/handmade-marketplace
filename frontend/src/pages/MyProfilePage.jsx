import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentUser,
  updateCurrentUser,
  uploadProfilePicture
} from "../api/usersApi";

import "../styles/MyProfilePage.css";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    bio: ""
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      const loadedUser = data.user;
      setUser(loadedUser);

      setFormData({
        username: loadedUser.username || "",
        bio: loadedUser.bio || ""
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      await updateCurrentUser(formData);
      setSuccess("Profile updated successfully.");
      await loadProfile();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    try {
      setUploading(true);
      await uploadProfilePicture(file);
      setSuccess("Profile picture updated successfully.");
      await loadProfile();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Profile not found.</p>;

  const profileImageUrl = user.pfpUrl
    ? `http://localhost:3000${user.pfpUrl}`
    : "/placeholder.png";

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="profile-header">
        <div className="profile-header__left">
          <img
            src={profileImageUrl}
            alt={user.username}
            className="profile-avatar"
          />

          <label className="profile-upload-label">
            {uploading ? "Uploading..." : "Upload profile picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              hidden
            />
          </label>
        </div>

        <div className="profile-header__right">
          <h2>{user.username}</h2>
          <p>{user.email}</p>

          {(user.firstName || user.lastName) && (
            <p>
              {user.firstName} {user.lastName}
            </p>
          )}

          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          {user.bio && <p>{user.bio}</p>}
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>Edit Profile</h2>

          <form className="profile-form" onSubmit={handleProfileUpdate}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />

            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <h2>Shipping Addresses</h2>

          {user.shippingAddresses?.length > 0 ? (
            <div className="profile-list">
              {user.shippingAddresses.map((address) => (
                <div key={address.id} className="profile-list-item">
                  <p>{address.street} {address.houseNo}</p>
                  <p>{address.neighborhood}, {address.city}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No shipping addresses saved.</p>
          )}
        </section>

        <section className="profile-card">
          <h2>My Items</h2>

          {user.items?.length > 0 ? (
            <div className="profile-list">
              {user.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="profile-list-item profile-list-item--link"
                >
                  <p><strong>{item.name}</strong></p>
                  <p>{item.price} {item.currency || "RSD"}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>You have not listed any items yet.</p>
          )}
        </section>

        <section className="profile-card">
          <h2>Favorites</h2>

          {user.favorites?.length > 0 ? (
            <div className="profile-list">
              {user.favorites.map((favorite) => (
                <Link
                  key={favorite.id}
                  to={`/items/${favorite.item?.id}`}
                  className="profile-list-item profile-list-item--link"
                >
                  <p><strong>{favorite.item?.name}</strong></p>
                  <p>{favorite.item?.price} {favorite.item?.currency || "RSD"}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>No favorites yet.</p>
          )}
        </section>

        <section className="profile-card profile-card--full">
          <h2>My Reviews</h2>

          {user.reviews?.length > 0 ? (
            <div className="profile-list">
              {user.reviews.map((review) => (
                <div key={review.id} className="profile-list-item">
                  <p>
                    <strong>
                      <Link to={`/items/${review.item?.id}`}>
                        {review.item?.name}
                      </Link>
                    </strong>
                  </p>
                  <p>Rating: {review.rating}/5</p>
                  <p>{review.comment}</p>
                  <p>
                    {new Date(review.reviewedOn).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not left any reviews yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}