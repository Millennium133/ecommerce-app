// frontend/src/pages/ProductDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data);
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        const userToken = localStorage.getItem('userToken'); // User token for authentication
        await axios.post(
            '/api/cart/add',
            { productId: id },
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        navigate.push('/cart');
    };

    return product ? (
        <div className="p-4">
            <img src={product.imageUrl} alt={product.title} className="h-64 w-full object-cover" />
            <h1 className="text-3xl">{product.title}</h1>
            <p>{product.description}</p>
            <p>{product.price} Coins</p>
            <button className="bg-green-500 text-white py-2 px-4" onClick={addToCart}>
                Add to Cart
            </button>
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default ProductDetail;
