import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import './Login.css';

const Register = ({ onToggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/users/signup', { email, password });
            window.location.href = '/';
        } catch (err) {
            setError(err.response.data.message || 'Registration failed');
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="submit-button scale" type="submit">Register</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <p className="toggle-text">
                Already have an account?{' '}
                <span onClick={onToggleForm} className="toggle-link">Login here</span>
            </p>
        </div>
    );
};

export default Register;