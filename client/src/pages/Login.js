import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError((err.response && err.response.data && err.response.data.message) || 'Login failed');
        }
        setLoading(false);
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.card } >
        <
        h2 style = { styles.title } > Welcome back < /h2> {
        error && < div style = { styles.error } > { error } < /div>} <
        form onSubmit = { handleSubmit } >
        <
        input style = { styles.input }
        type = "email"
        placeholder = "Email"
        value = { email }
        onChange = { e => setEmail(e.target.value) }
        required / >
        <
        input style = { styles.input }
        type = "password"
        placeholder = "Password"
        value = { password }
        onChange = { e => setPassword(e.target.value) }
        required / >
        <
        button style = { styles.btn }
        type = "submit"
        disabled = { loading } > { loading ? 'Logging in...' : 'Login' } < /button> < /
        form > <
        p style = { styles.footer } > Don 't have an account? <Link to="/register">Sign up</Link></p> < /
        div > <
        /div>
    );
};

const styles = {
    container: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '24px', color: '#333' },
    input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '500' },
    error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    footer: { textAlign: 'center', marginTop: '16px', fontSize: '14px' },
};

export default Login;