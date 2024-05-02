
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
        }
    
        axios.post('http://localhost:5000/api/register', { username, email, password })
        .then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', JSON.stringify(response.data.userId));
            navigate('/');
            window.location.reload();

        })
        .catch((error) => {
            console.log(error);
            setError(error.response.data.message);
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-8 w-full">
            <div className="w-full md:w-1/3">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Sign Up
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                    <p className="text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;