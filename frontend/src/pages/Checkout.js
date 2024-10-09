import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorPage from "../components/ErrorPage";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("coins"); // Default
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isFailed, setIsFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/cart");
        setCartItems(response.data.items);
      } catch (err) {
        setError(`Failed to load cart: ${err}`);
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
      console.log(shippingAddress);
      console.log(paymentMethod);
      await axiosInstance.post("/api/cart/checkout", {
        shippingAddress,
        paymentMethod,
      });
      setMessage("Order placed successfully!");
      setIsFailed(false);
      navigate("/confirmation");
    } catch (error) {
      setIsFailed(true);
      setMessage(`Checkout failed. Please try again. ${error}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-primary mb-4">Checkout</h2>

          {/* Message Display */}
          {message && (
            <p
              className={`text-lg ${
                isFailed ? "text-red-500" : "text-green-500"
              } mb-4`}
            >
              {message}
            </p>
          )}

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId._id}
                className="bg-white p-4 shadow-md flex justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {item.productId.title}
                  </h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">
                  {item.productId.price * item.quantity} Coins
                </p>
              </div>
            ))}
          </div>

          {/* Total and Form */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold">Total: {totalAmount} Coins</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckout();
              }}
              className="mt-6"
            >
              {/* Shipping Address */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Shipping Address
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="border rounded-lg p-3 w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border rounded-lg p-3 w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                >
                  <option value="coins">Coins</option>
                  <option value="creditCard">Credit Card</option>
                  {/* Other payment methods */}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-primary text-white p-3 w-full rounded-lg hover:bg-accent transition duration-200"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
