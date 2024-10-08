import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import AdminDashboard from "./pages/AdminDashboard";
import OrderHistory from "./pages/OrderHistory";
import EditProduct from "./pages/EditProduct";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderHistory"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
