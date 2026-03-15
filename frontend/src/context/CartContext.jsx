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
      console.log("Fetched cart:", res.data);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) return;

    try {
      await api.post("/cart/items", {
        id: itemId,
        quantity
      });
      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  };

  const decreaseQuantity = async (cartItemId) => {
    if (!token) return;

    try {
      await api.patch(`/cart/items/${cartItemId}/decrease`);
      await fetchCart();
    } catch (err) {
      console.error("Decrease quantity failed:", err.response?.data || err.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!token) return;

    try {
      await api.delete(`/cart/items/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
    }
  };

  const emptyCart = async () => {
    if (!token) return;

    try {
      await api.delete("/cart");
      await fetchCart();
    } catch (err) {
      console.error("Empty cart failed:", err.response?.data || err.message);
    }
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
        decreaseQuantity,
        removeFromCart,
        emptyCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};