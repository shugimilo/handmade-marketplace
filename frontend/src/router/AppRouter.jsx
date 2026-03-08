import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../components/layout/Layout"

import Home from "../pages/Home.jsx"
import Categories from "../pages/Categories"
import Cart from "../pages/Cart"
import Profile from "../pages/Profile"
import Shop from "../pages/Shop"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}