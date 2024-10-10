import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import { FaCoins, FaBars } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown"; // Separated component
import DropdownMenu from "./DropdownMenu"; // New DropdownMenu component

const Header = () => {
  const [coins, setCoins] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinResponse = await axiosInstance.get("/api/user/coins");
        const notificationsResponse = await axiosInstance.get(
          "/api/notifications"
        );

        setCoins(coinResponse.data.coins);
        setNotifications(notificationsResponse.data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-6 relative">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          <Link to="/">E-Shop</Link>
        </h1>
        <div className="flex items-center space-x-6">
          {/* Coins display */}
          <div className="flex items-center space-x-2">
            <FaCoins className="text-yellow-500" />
            <span>{coins} Coins</span>
          </div>

          {/* Notification Dropdown */}
          <NotificationDropdown
            notifications={notifications}
            dropdownOpen={dropdownOpen}
            toggleDropdown={() => setDropdownOpen(!dropdownOpen)}
            setNotifications={setNotifications}
          />

          {/* Hamburger menu icon */}
          <FaBars
            className="text-2xl cursor-pointer text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </div>

      {/* Dropdown menu for navigation */}
      <DropdownMenu isOpen={menuOpen} onLogout={handleLogout} />
    </header>
  );
};

export default Header;
