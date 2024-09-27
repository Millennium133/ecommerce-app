// frontend/src/pages/CheckoutPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
    const navigate = useNavigate();

    const handleCheckout = async () => {
        // Make an API call to handle payment
        // ...

        navigate.push('/');  // Redirect to home page after successful checkout
    };

    return (
        <div className="p-4">
            <h2>Checkout</h2>
            <button className="bg-green-500 text-white py-2 px-4" onClick={handleCheckout}>
                Confirm Purchase
            </button>
        </div>
    );
}

export default CheckoutPage;
