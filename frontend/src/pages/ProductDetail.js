import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`); // Adjust URL as needed
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const addToCart = async () => {
    try {
      const response = await axiosInstance.put("/api/cart", {
        productId: product._id,
        quantity: quantity, // For simplicity, adding one item to the cart
      });
      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

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
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
