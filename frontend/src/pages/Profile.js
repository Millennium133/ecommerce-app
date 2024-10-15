import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";
import ErrorPage from "../components/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import { FaCoins, FaEnvelope, FaUser, FaUserEdit } from "react-icons/fa";
import DOMPurify from "dompurify";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFailed, setIsFailed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user/profile"); // API call to get user details
        setEmail(response.data.email);
        setName(response.data.name);
        setRole(response.data.role);
        setCoins(response.data.coins);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const sanitizedName = DOMPurify.sanitize(name);
      const sanitizedEmail = DOMPurify.sanitize(email);
      await axiosInstance.put(`/api/user/profile`, {
        name: sanitizedName,
        email: sanitizedEmail,
      });
      setIsFailed(false);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setIsFailed(true);
      setMessage("Error updating Profile");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-4xl font-bold text-center text-primary mb-6">
            Profile
          </h2>
          {message && (
            <p
              className={`text-center text-xl mb-6 ${
                isFailed ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="mb-3">
              <label className="block text-lg font-semibold mb-2">
                {" "}
                <FaEnvelope className="inline mb-1 text-gray-600" /> Email
              </label>
              <input
                type="email"
                value={email}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                {" "}
                <FaUser className="inline mb-1 text-gray-600" /> Name
              </label>
              <input
                type="text"
                value={name}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                {" "}
                <FaUserEdit className="inline mb-1 text-gray-600" /> Role
              </label>
              <input
                type="text"
                value={role}
                className="border border-gray-300 p-3 w-full rounded-lg bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                {" "}
                <FaCoins className="inline mb-1 text-yellow-500" /> Coins
              </label>
              <input
                type="number"
                value={coins}
                className="border border-gray-300 p-3 w-full rounded-lg bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white p-3 w-full rounded-lg hover:bg-primary-dark transition-all"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
