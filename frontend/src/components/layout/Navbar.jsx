import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { searchAll } from "../../api/searchApi";
import { getCurrentUser } from "../../api/usersApi";
import { isCurrentUserAdmin } from "../../utils/admin";

import "../../styles/Navbar.css";
import formatCategoryName from "../../utils/categoryName";

export default function Navbar() {
  const { isAuthenticated, logout, token } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const dropdownRef = useRef(null);

  const cartItemCount = cart?.cart?.cartItems?.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0
  ) || 0;

  const runSearch = debounce(async (q) => {
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }

    try {
      const data = await searchAll(q, 1, 5);
      setResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  useEffect(() => {
    runSearch(searchQuery);

    return () => {
      runSearch.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const data = await getCurrentUser();
        setCurrentUser(data.user || null);
      } catch (err) {
        console.error("Failed to load navbar user:", err);
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, [token]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setShowDropdown(false);
  };

  const handleNavigate = (url) => {
    navigate(url);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const profileImageUrl = currentUser?.pfpUrl
    ? `http://localhost:3000${currentUser.pfpUrl}`
    : "/placeholder.png";

  const isAdmin = isCurrentUserAdmin();

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          Handmade.
        </Link>
      </div>

      <div className="navbar-search" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search items, users, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => results && setShowDropdown(true)}
          />
        </form>

        {showDropdown && results && (
          <div className="search-dropdown">
            {results.items?.length > 0 && (
              <div className="search-dropdown-section">
                <p className="search-dropdown-title">Items</p>

                {results.items.map((item) => {
                  const imageUrl = item.itemImages?.[0]?.url
                    ? `http://localhost:3000${item.itemImages[0].url}`
                    : "/placeholder.png";

                  return (
                    <div
                      key={item.id}
                      className="search-dropdown-item search-dropdown-item--item"
                      onClick={() => handleNavigate(`/items/${item.id}`)}
                    >
                      <img src={imageUrl} alt={item.name} />

                      <div className="search-dropdown-item__info">
                        <span className="search-dropdown-item__name">
                          {item.name}
                        </span>

                        <span className="search-dropdown-item__price">
                          {item.price} {item.currency || "RSD"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {results.users?.length > 0 && (
              <div className="search-dropdown-section">
                <p className="search-dropdown-title">Users</p>

                {results.users.map((user) => {
                  const avatarUrl = user.pfpUrl
                    ? `http://localhost:3000${user.pfpUrl}`
                    : "/placeholder.png";

                  const profileUrl =
                    currentUser && Number(user.id) === Number(currentUser.id)
                      ? "/me"
                      : `/users/${user.id}`;

                  return (
                    <div
                      key={user.id}
                      className="search-dropdown-item search-dropdown-item--user"
                      onClick={() => handleNavigate(profileUrl)}
                    >
                      <img src={avatarUrl} alt={user.username} />
                      <span>{user.username}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {results.categories?.length > 0 && (
              <div className="search-dropdown-section">
                <p className="search-dropdown-title">Categories</p>

                {results.categories.map((category) => (
                  <div
                    key={category.id}
                    className="search-dropdown-item"
                    onClick={() => handleNavigate(`/categories/${category.id}`)}
                  >
                    {formatCategoryName(category.name)}
                  </div>
                ))}
              </div>
            )}

            <div
              className="search-dropdown-all"
              onClick={() =>
                handleNavigate(`/search?q=${encodeURIComponent(searchQuery)}`)
              }
            >
              See all results →
            </div>
          </div>
        )}
      </div>

      <div className="navbar__right">
        <Link to="/">Home</Link>
        <Link to="/categories">Browse</Link>
        <Link to="/cart" className="navbar__cart-link">
          Cart
          {cartItemCount > 0 && (
            <span className="navbar__cart-count">{cartItemCount}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/orders">Orders</Link>
            <Link to="/items/new">Sell Item</Link>

            <Link to="/me" className="navbar__profile-link">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="navbar__profile-avatar"
              />
              <span>{currentUser?.username || "Profile"}</span>
            </Link>

            {isAdmin && <Link to="/admin">Admin</Link>}

            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}