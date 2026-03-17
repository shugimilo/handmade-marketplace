import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/HomePage.css";
import "./styles/App.css";
import "./styles/index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);