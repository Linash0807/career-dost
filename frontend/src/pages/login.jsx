import React, { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login to:', api.defaults.baseURL);
            const response = await api.post('/auth/login', { email, password });
            console.log('Login successful');
            login(response.data.token);
        } catch (err) {
            console.error('Login error details:', err);
            const msg = err.response ? err.response.data.message : 'Login failed: ' + err.message;
            setError(msg);
            if (!err.response) {
                alert('Connection Error: Is VITE_API_URL correct? Expected backend URL, not frontend URL.');
            }
        }
    };
    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;
