import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-secondary">
          Order History
        </h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold text-primary">
                Order #{order._id}
              </h3>
              <p className="text-gray-500">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xl font-bold text-accent">
                Total: {order.totalAmount} Coins
              </p>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>
                      {item.title} (x{item.quantity})
                    </span>
                    <span>{item.productId.price * item.quantity} Coins</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
