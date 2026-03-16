import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchAll } from "../api/searchApi";

export default function SearchResultsPage() {
  const location = useLocation();

  const [results, setResults] = useState({
    users: [],
    items: [],
    categories: [],
    pagination: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const page = Number(params.get("page")) || 1;

  useEffect(() => {
    const runSearch = async () => {
      if (!query || query.trim().length < 2) {
        setResults({
          users: [],
          items: [],
          categories: [],
          pagination: null
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await searchAll(query, page, 5);
        setResults(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query, page]);

  if (loading) return <p>Searching...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      <p>
        Results for: <strong>{query}</strong>
      </p>

      <section className="search-section">
        <h2>Items</h2>

        {results.items?.length > 0 ? (
          <div className="search-items-grid">
            {results.items.map((item) => {
              const imageUrl = item.itemImages?.[0]?.url
                ? `http://localhost:3000${item.itemImages[0].url}`
                : "/placeholder.png";

              return (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="search-item-card"
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="search-item-card__image"
                  />
                  <div className="search-item-card__content">
                    <h3>{item.name}</h3>
                    <p>{item.price} {item.currency || "RSD"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>No matching items found.</p>
        )}
      </section>

      <section className="search-section">
        <h2>Users</h2>

        {results.users?.length > 0 ? (
          <div className="search-users-list">
            {results.users.map((user) => {
              const imageUrl = user.pfpUrl
                ? `http://localhost:3000${user.pfpUrl}`
                : "/placeholder.png";

              return (
                <Link
                  key={user.id}
                  to={getProfileUrl(user.id)}
                  className="search-user-card"
                >
                  <img
                    src={imageUrl}
                    alt={user.username}
                    className="search-user-card__image"
                  />
                  <div>
                    <h3>{user.username}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>No matching users found.</p>
        )}
      </section>

      <section className="search-section">
        <h2>Categories</h2>

        {results.categories?.length > 0 ? (
          <div className="search-categories-list">
            {results.categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="item-page__category-badge"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <p>No matching categories found.</p>
        )}
      </section>
    </div>
  );
}