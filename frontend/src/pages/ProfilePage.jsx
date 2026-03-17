import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserProfile } from "../api/usersApi";
import ProductCard from "../components/products/ProductCard";

//import "../styles/PublicProfilePage.css";
import "../styles/MyProfilePage.css";
import "../styles/ProductCard.css";

export default function ProfilePage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(id);
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found.</p>;

  const profileImageUrl = user.pfpUrl
    ? `http://localhost:3000${user.pfpUrl}`
    : "/placeholder.png";

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header__left">
          <img
            src={profileImageUrl}
            alt={user.username}
            className="profile-avatar"
          />
        </div>

        <div className="profile-header__right">
          <h1>{user.username}</h1>

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
          <h2>Items</h2>

          {user.items?.length > 0 ? (
            <div className="products-grid">
              {user.items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p>This user has not listed any items yet.</p>
          )}
        </section>

        <section className="profile-card profile-card--full">
          <h2>Reviews</h2>

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

                  {review.comment && <p>{review.comment}</p>}

                  <p>
                    {new Date(review.reviewedOn).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}