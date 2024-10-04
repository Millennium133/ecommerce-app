import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrash } from "react-icons/fa"; // Trash icon for removing items

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState(0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/cart");
        setCartItems(response.data.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-secondary">Your Cart</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-6 shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-xl font-bold text-accent">
                {item.productId.price * item.quantity} Coins
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-2xl">Total: {totalAmount} Coins</h3>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-primary text-white p-3 rounded-lg hover:bg-accent transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </main>
    </div>
  );
};

export default Cart;
