import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
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
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/products/${id}`, {
        title,
        description,
        price,
        category,
        imageUrl,
      });
      setMessage("Product updated successfully");
      setTimeout(() => navigate("/admin"), 2000); // Redirect to Admin Dashboard after 2 seconds
    } catch (error) {
      setMessage("Error updating product");
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleEditProduct}>
          <div className="mb-4">
            <label className="block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Price (in Coins)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
