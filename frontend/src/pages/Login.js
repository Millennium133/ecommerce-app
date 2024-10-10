import React, { useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      navigate("/");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleFacebookLogout = () => {
    window.FB.logout();
  };

  const handleFacebookSuccess = async (response) => {
    // Log the user out of Facebook to allow switching accounts
    handleFacebookLogout();

    if (!response.accessToken) {
      // If the user pressed "cancel" or there was an error, display an error message
      setError("Facebook login canceled. Please try again.");
      return;
    }
    try {
      const res = await axiosInstance.post("/api/auth/facebook-login", {
        accessToken: response.accessToken,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/");
    } catch (error) {
      setError("Facebook login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axiosInstance.post("/api/auth/google-login", {
        token: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-300 via-gray-300 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-primary text-white p-2 w-full rounded-lg shadow hover:bg-primary-dark transition duration-150"
          >
            Login
          </button>
        </form>
        <div className="mt-6 space-y-2">
          {/* <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          /> */}
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email"
            callback={handleFacebookSuccess}
            textButton="Login with Facebook"
            cssClass="bg-blue-600 text-white p-2 w-full rounded-lg shadow hover:bg-blue-700 transition duration-150"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline transition duration-150"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
