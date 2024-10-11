import React, { useEffect, useState } from "react";
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
import { initSocket } from "./services/socket"; // Import the socket service
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    initSocket(process.env.REACT_APP_API_URL); // Replace with your server URL
    setIsSocketReady(true); // Mark the socket as initialized
  }, []);
  if (!isSocketReady) {
    // Optionally render a loading state until socket is ready
    return <LoadingSpinner />;
  }
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <ProductList />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <ProductDetail />{" "}
            </ProtectedRoute>
          }
        />
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
