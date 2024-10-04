import { Link } from 'react-router-dom';
const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to login after logout
};
    
const Header = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">
          <Link to="/">E-Shop</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-primary hover:text-text">Products</Link>
            </li>
            <li>
              <Link to="/cart" className="text-primary hover:text-text">Cart</Link>
            </li>
            <li>
                <button onClick={handleLogout} className="text-primary hover:text-text">Logout</button>
            </li>
          </ul>

        </nav>
      </div>
    </header>
  );
};

export default Header;
