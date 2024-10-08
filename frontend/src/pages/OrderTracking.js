import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders"); // API call to get user orders
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold">Order #{order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              {/* Other order details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
