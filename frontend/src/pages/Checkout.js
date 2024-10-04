import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/cart");

        setCartItems(response.data.items);
      } catch (err) {
        setError("Failed to load cart");
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

  const handleCheckout = async () => {
    try {
      await axiosInstance.post("/api/cart/checkout");
      navigate("/confirmation");
    } catch (err) {
      setError("Checkout failed. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-4 shadow-md flex justify-between"
            >
              <div>
                <h3 className="text-xl">{item.productId.title}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold">
                {item.productId.price * item.quantity} Coins
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-2xl">Total: {totalAmount} Coins</h3>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-primary text-white p-2"
          >
            Confirm Purchase
          </button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
