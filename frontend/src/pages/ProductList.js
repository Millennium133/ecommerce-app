import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorPage from "../components/ErrorPage";
import { LazyLoadImage } from "react-lazy-load-image-component"; // Lazy load package
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaStar } from "react-icons/fa"; // Import star icon

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // Number of products per page

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const productResponse = await axiosInstance.get("/api/products");
        const wishlistResponse = await axiosInstance.get("/api/wishlist");
        setProducts(productResponse.data);
        setWishlist(wishlistResponse.data.map((item) => item.productId._id));
      } catch (error) {
        setError(`Error fetching products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleToggleWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      await axiosInstance.delete(`/api/wishlist/${productId}`);
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      // Add to wishlist
      await axiosInstance.post("/api/wishlist", { productId });
      setWishlist([...wishlist, productId]);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error} />;

  // Sort products: wishlist items first
  const sortedProducts = products.sort((a, b) => {
    const aInWishlist = wishlist.includes(a._id);
    const bInWishlist = wishlist.includes(b._id);

    // Prioritize wishlist items
    return aInWishlist === bInWishlist ? 0 : aInWishlist ? -1 : 1;
  });

  // Calculate the displayed products based on current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-secondary">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                {" "}
                {/* Make this container relative */}
                <LazyLoadImage
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  effect="blur"
                />
                <FaStar
                  className={`absolute top-2 right-2 cursor-pointer text-2xl ${
                    wishlist.includes(product._id)
                      ? "text-yellow-300" // Color when added to wishlist
                      : "text-gray-500" // Color when not added to wishlist
                  }`}
                  onClick={() => handleToggleWishlist(product._id)}
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {product.title}
              </h3>
              <p className="text-gray-500 text-lg">{product.description}</p>
              <p className="text-xl font-bold text-accent mt-4">
                {product.price} Coins
              </p>
              <Link
                to={`/product/${product._id}`}
                className="block mt-6 text-secondary hover:underline text-lg"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductList;
