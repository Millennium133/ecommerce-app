import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { FaShoppingCart, FaCoins, FaBars } from "react-icons/fa"; // Import icons
import { TbJewishStarFilled } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaProductHunt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-md p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          <Link to="/">E-Shop</Link>
        </h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <FaCoins className="text-yellow-500" />
            <span>{coins} Coins</span>
          </div>
          <button onClick={toggleMenu} className="text-primary">
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="bg-gray-100 p-6 rounded-lg mt-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/profile"
                className="text-primary hover:text-text flex items-center space-x-2"
              >
                <CgProfile />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-primary hover:text-text flex items-center space-x-2"
              >
                <FaProductHunt />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-primary hover:text-text flex items-center space-x-2"
              >
                <FaShoppingCart className="text-primary" /> {/* Cart Icon */}
                <span>Cart</span>
              </Link>{" "}
            </li>

            <li>
              <Link
                className="text-primary hover:text-text flex items-center space-x-2"
                to="/wishlist"
              >
                <TbJewishStarFilled />
                <span>Wishlist</span>
              </Link>
            </li>
            <li>
              <Link
                className="text-primary hover:text-text flex items-center space-x-2"
                to="/admin"
              >
                <MdDashboard />
                <span>Admin Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-primary hover:text-text flex items-center space-x-2"
              >
                <IoLogOut />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
