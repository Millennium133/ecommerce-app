// frontend/src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await axios.post('/api/auth/register', { name, email, password });
        localStorage.setItem('userToken', response.data.token);
        navigate.push('/');
    };

    return (
        <form onSubmit={handleRegister} className="p-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4">Register</button>
        </form>
    );
}

export default Register;
