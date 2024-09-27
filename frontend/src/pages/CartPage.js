// frontend/src/pages/CartPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



function CartPage() {
    const [cart, setCart] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const userToken = localStorage.getItem('userToken');
        const response = await axios.get('/api/cart', {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        setCart(response.data);
    };

    const removeProduct = async (productId) => {
        const userToken = localStorage.getItem('userToken');
        await axios.delete(`/api/cart/remove/${productId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        // Fetch updated cart after removing the product
        fetchCart();
    };
    
    // Function to update the quantity of a product in the cart
    const updateQuantity = async (productId, quantity) => {
        if ( quantity < -1 || isNaN(quantity)){
            alert('Quantity  must bee a valid number and aat least 1.');
            return
        }
        try {
            const userToken = localStorage.getItem('userToken'); // Assuming the user is authenticated
            await axios.put('/api/cart', { productId, quantity: parseInt(quantity) }, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            // Fetch the updated cart after updating the quantity
            fetchCart();
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('An error occurred while updating the quantity.');
            }
        }
    };
    return cart ? (
        <div className="cart-items p-4">
            {cart.items.length > 0 ? (
                cart.items.map((item) => (
                    <div key={item.productId._id} className="border p-4 mb-4">
                        <h3>{item.productId.title}</h3>
                        <p>Price: {item.productId.price} Coins</p>

                        {/* Quantity input and update button */}
                        <div className="quantity-control">
                            <label htmlFor={`quantity-${item.productId._id}`}>Quantity: </label>
                            <input
                                type="number"
                                id={`quantity-${item.productId._id}`}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId._id, e.target.value)}
                                className="border p-2 w-16"
                                min="1"
                            />
                        </div>

                        {/* Remove button for each product */}
                        <button
                            onClick={() => removeProduct(item.productId._id)}
                            className="bg-red-500 text-white py-1 px-4 mt-2"
                        >
                            Remove
                        </button>
                    </div>
                ))
            ) : (
                <p>Your cart is empty</p>
            )}
            <h4>Total: {cart.totalAmount} Coins</h4>
        </div>
    ) : (
        <p>Loading cart...</p>
    );
}

export default CartPage;
