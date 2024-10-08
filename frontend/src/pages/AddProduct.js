import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", {
        title,
        description,
        price,
        category,
        imageUrl,
      });
      setMessage("Product added successfully");
    } catch (error) {
      setMessage("Error adding product");
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Add Product</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleAddProduct}>
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
            <label className="block">Category </label>
            <input
              value={price}
              onChange={(e) => setCategory(e.target.value)}
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
            Add Product
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
