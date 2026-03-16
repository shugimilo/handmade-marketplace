import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ItemPage from "../pages/ItemPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import MyProfilePage from "../pages/MyProfilePage";
import CreateItemPage from "../pages/CreateItemPage";
import ProfilePage from "../pages/ProfilePage";
import EditItemPage from "../pages/EditItemPage";

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

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items/new"
          element={
            <ProtectedRoute>
              <CreateItemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id" element={<ProfilePage />} />

        <Route
          path="/items/:id/edit"
          element={
            <ProtectedRoute>
              <EditItemPage />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}