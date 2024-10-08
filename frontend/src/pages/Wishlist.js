import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import ErrorPage from "../components/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/api/wishlist"); // Fetch wishlist from backend
        setWishlist(response.data);
        setLoading(false);
      } catch (error) {
        setError(`Error fetching wishlist: ${error}`);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/api/wishlist/${productId}`);
      setWishlist(wishlist.filter((item) => item.productId !== productId));
    } catch (error) {
      setError(`Error removing product from wishlist: ${error}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty. Start adding products!</p>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-6 shadow-md rounded-lg flex justify-between items-center"
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
