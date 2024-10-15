import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import DOMPurify from "dompurify";

const EditProduct = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isFailed, setIsFailed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        const product = response.data;
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setImageUrl(product.imageUrl);
      } catch (error) {
        setError("Error fetching product: " + error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const sanitizedTitle = DOMPurify.sanitize(title);
      const sanitizedDescription = DOMPurify.sanitize(description);
      const sanitizedPrice = DOMPurify.sanitize(price);
      const sanitizedCategory = DOMPurify.sanitize(category);
      const sanitizedImageUrl = DOMPurify.sanitize(imageUrl);

      await axiosInstance.put(`/api/products/${id}`, {
        title: sanitizedTitle,
        description: sanitizedDescription,
        price: sanitizedPrice,
        category: sanitizedCategory,
        imageUrl: sanitizedImageUrl,
      });
      setIsFailed(false);
      setMessage("Product updated successfully");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (error) {
      setIsFailed(true);
      setMessage("Error updating product: " + error.message);
    }
  };

  if (error) return <ErrorPage message={error} />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Edit Product
        </h2>
        {message && (
          <p
            className={`text-xl text-center ${
              isFailed ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
        <form
          onSubmit={handleEditProduct}
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              aria-label="Product Title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              aria-label="Product Description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              aria-label="Product Category"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Price (in Coins)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              aria-label="Product Price"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              aria-label="Product Image URL"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
