import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrash } from "react-icons/fa"; // Trash icon for removing items

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await axiosInstance.get("/api/cart");
        const coinsResponse = await axiosInstance.get("/api/user/coins");
        setCartItems(cartResponse.data.items);
        setCoins(coinsResponse.data.coins);
        calculateTotal(cartResponse.data.items);
      } catch (error) {
        console.error("Error fetching cart or coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
    setTotalAmount(Math.round(total));
  };

  const handleQuantityChange = async (productId, change) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.productId._id === productId) {
        const newQuantity = Math.max(1, item.quantity + change); // Prevent quantity from going below 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);
    // Update cart in backend
    await axiosInstance.put("/api/cart", {
      productId,
      quantity: updatedCartItems.find(
        (item) => item.productId._id === productId
      ).quantity,
    });
  };

  const handleRemove = async (productId) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.productId._id !== productId
    );
    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);
    // Remove item from cart in backend
    await axiosInstance.delete(`/api/cart/remove/${productId}`);
  };

  const handleCheckout = () => {
    if (totalAmount > coins) {
      setError("Not enough coins to proceed with checkout");
    } else {
      setError("");
      navigate("/checkout"); // Proceed to checkout
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-secondary">Your Cart</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-6 shadow-md rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {item.productId.title}
                  </h3>
                  <p className="text-gray-500">
                    Price: {item.productId.price} Coins
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {" "}
                {/* Space between buttons */}
                <button
                  onClick={() => handleQuantityChange(item.productId._id, -1)}
                  className="px-3 py-1 bg-gray-200 rounded-l-lg"
                >
                  -
                </button>
                <span className="w-12 text-xl bg-gray-100 flex items-center justify-center">
                  {" "}
                  {/* Fixed width */}
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.productId._id, 1)}
                  className="px-3 py-1 bg-gray-200 rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="text-red-500 ml-4"
              >
                <FaTrash />
              </button>
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
