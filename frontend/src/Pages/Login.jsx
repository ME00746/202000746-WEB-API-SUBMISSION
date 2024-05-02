import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/login', { email, password })
        .then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', JSON.stringify(response.data.id));

            navigate('/');
            window.location.reload();
        })
        .catch((error) => {
            setError(error.response.data.message);
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-8 w-full">
            <div className="w-full md:w-1/3">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;