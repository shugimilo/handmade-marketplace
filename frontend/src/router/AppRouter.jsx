import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ItemPage from "../pages/ItemPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items/:id" element={<ItemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}