import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axiosInstance.get("/api/products");
        const userResponse = await axiosInstance.get("/api/admin/users");
        setProducts(productResponse.data);
        setUsers(userResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditingProduct = async (product) => {
    try {
      const { title, description, price, category, imageUrl } = product;
      await axiosInstance.put(`/api/products/${product._id}`).send({
        title,
        description,
        price,
        category,
        imageUrl,
      });
    } catch (error) {
      console.error(`Error editing product: ${error}`);
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/api/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-secondary">
          Admin Dashboard
        </h2>

        {/* Product Management */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Manage Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 shadow-md rounded-lg"
              >
                <h4 className="text-xl font-bold">{product.title}</h4>
                <p>Price: {product.price} Coins</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleEditingProduct(product)}
                    className="text-blue-500"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Management */}
        <section>
          <h3 className="text-2xl font-bold text-primary mb-4">Manage Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-6 shadow-md rounded-lg">
                <h4 className="text-xl font-bold">
                  {user.name} ({user.role})
                </h4>
                <p>Email: {user.email}</p>
                <div className="flex space-x-4 mt-4">
                  {/* You can add role management later */}
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
