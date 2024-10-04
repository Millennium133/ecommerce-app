import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products"); // Adjust URL as needed
        setProducts(response.data);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-secondary">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-primary mb-2">
                {product.title}
              </h3>
              <p className="text-gray-500 text-lg">{product.description}</p>
              <p className="text-xl font-bold text-accent mt-4">
                {product.price} Coins
              </p>
              <Link
                to={`/product/${product._id}`}
                className="block mt-6 text-secondary hover:underline text-lg"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
