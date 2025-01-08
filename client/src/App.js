import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import { isAuthenticated } from './utils/auth';

const App = () => {
    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated() ? <Dashboard />: showLogin ? <Login onToggleForm={toggleForm} /> : <Register onToggleForm={toggleForm} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
