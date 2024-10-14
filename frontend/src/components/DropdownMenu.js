import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaProductHunt, FaShoppingCart } from "react-icons/fa";
import { TbJewishStarFilled } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";

const DropdownMenu = ({ isOpen, onLogout, menuRef }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-20"
      style={{ top: "100%", left: 0 }} // Ensure it positions below and to the left of the trigger
    >
      {" "}
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
            <FaShoppingCart />
            <span>Cart</span>
          </Link>
        </li>
        <li>
          <Link
            to="/wishlist"
            className="text-primary hover:text-text flex items-center space-x-2"
          >
            <TbJewishStarFilled />
            <span>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin"
            className="text-primary hover:text-text flex items-center space-x-2"
          >
            <MdDashboard />
            <span>Admin Dashboard</span>
          </Link>
        </li>
        <li>
          <button
            onClick={onLogout}
            className="text-primary hover:text-text flex items-center space-x-2"
          >
            <IoLogOut />
            <span>Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
