import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { FaShoppingCart, FaCoins } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axiosInstance.get("/api/user/coins");
        setCoins(response.data.coins);
      } catch (error) {
        console.error(`Error fetching coins: ${error}`);
      }
    };

    fetchCoins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <header className="bg-white shadow-md p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          <Link to="/">E-Shop</Link>
        </h1>
        <nav className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <FaCoins className="text-yellow-500" /> {/* Coins Icon */}
            <span>{coins} Coins</span>
          </div>
          <Link to="/" className="text-primary hover:text-text">
            Products
          </Link>
          <Link
            to="/cart"
            className="text-primary hover:text-text flex items-center space-x-2"
          >
            <FaShoppingCart className="text-primary" /> {/* Cart Icon */}
            <span>Cart</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-primary hover:text-text"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
