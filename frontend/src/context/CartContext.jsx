import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) {
      console.warn("User must be logged in to add items to cart.");
      return;
    }

    await api.post("/cart/items", {
      id: itemId,
      quantity
    });

    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;

    await api.delete(`/cart/items/${itemId}`);
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};