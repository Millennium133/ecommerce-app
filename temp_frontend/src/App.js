// frontend/src/App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Register from './pages/Register';
import Login from './pages/Login';
// import Navbar from './components/Navbar';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />

                <Route path="/"  element={<ProductList/>} />
                <Route path="/product/:id" element={<ProductDetail/>} />
                <Route path="/cart" element={<CartPage/>} />
                <Route path="/checkout" element={<CheckoutPage/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>  
        {/* <div>
            <h1>App is Running</h1>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="*" element={<h1>404: Not Found</h1>} />
            </Routes>
        </div> */}
        </>
    );
}

export default App;
