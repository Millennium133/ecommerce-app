import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../services/axiosConfig";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-secondary">
          Admin Dashboard
        </h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold text-primary">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm">Role: {user.role}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
