import React, { useState } from "react";
import axiosInstance from "../services/axiosConfig";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // Save JWT token in local storage
      localStorage.setItem("role", response.data.role);
      window.location.href = "/"; // Redirect to homepage after successful registration
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-primary text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
