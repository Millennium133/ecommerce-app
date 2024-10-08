import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";
import ErrorPage from "../components/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user/profile"); // API call to get user details
        console.log(response.data);
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
      await axiosInstance.put(`/api/profile/${id}`, {
        name,
        email,
      });
      setMessage("User updated successfully");
    } catch (error) {
      setMessage("Error updating product");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            className="border p-2 w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block">Name</label>
          <input
            type="text"
            value={name}
            className="border p-2 w-full"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block">role</label>
          <input
            type="text"
            value={role}
            className="border p-2 w-full"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block">coins</label>
          <input
            type="number"
            value={coins}
            className="border p-2 w-full"
            readOnly
          />
        </div>
        <button type="submit" className="bg-primary text-white p-3 rounded-lg">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
