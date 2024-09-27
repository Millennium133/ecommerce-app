// frontend/src/pages/ProductList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {products.map((product) => (
                <div key={product._id} className="border p-4">
                    <img src={product.imageUrl} alt={product.title} className="h-32 w-full object-cover" />
                    <h3 className="text-xl">{product.title}</h3>
                    <p>{product.price} Coins</p>
                    <Link to={`/product/${product._id}`}>
                        <button className="bg-blue-500 text-white py-1 px-4 mt-2">View Details</button>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
