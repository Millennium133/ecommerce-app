import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorPage from "../components/ErrorPage";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`); // Adjust URL as needed
        const cartResponse = await axiosInstance.get("/api/cart");
        const cartItems = cartResponse.data.items;
        setProduct(response.data);
        cartItems.forEach((item) => {
          if (item.productId._id === id) {
            setCurrentQuantity(item.quantity);
          }
          return;
        });
      } catch (error) {
        setError(`Error fetching product details: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = async (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const addToCart = async () => {
    try {
      const overallQuantity = currentQuantity + quantity;
      await axiosInstance.put("/api/cart", {
        productId: product._id,
        quantity: overallQuantity,
      });
      setIsAddedToCart(true); // Show feedback
      setTimeout(() => setIsAddedToCart(false), 3000);
    } catch (error) {
      console.error(`Error adding product to cart: ${error}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <h2 className="text-4xl font-bold text-primary mb-4">
            {product.title}
          </h2>
          <p className="text-lg text-gray-500 mb-6">{product.description}</p>
          <p className="text-2xl font-bold text-accent mb-4">
            {product.price} Coins
          </p>
          <div className="flex items-center mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 bg-gray-200 rounded-l-lg"
            >
              -
            </button>
            <span className="px-6 py-2 text-xl bg-gray-100">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 bg-gray-200 rounded-r-lg"
            >
              +
            </button>
          </div>
          <button
            onClick={addToCart}
            className="mt-4 bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-accent transition-colors"
          >
            Add to Cart
          </button>

          {isAddedToCart && (
            <p className="text-green-500 mt-4">Product added to cart!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
