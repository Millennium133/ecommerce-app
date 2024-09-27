// frontend/src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('userToken', response.data.token);
        navigate.push('/');
    };

    return (
        <form onSubmit={handleLogin} className="p-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4">Login</button>
        </form>
    );
}

export default Login;
