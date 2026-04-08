import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(form.name, form.email, form.password, form.role, form.phone);
            navigate('/');
        } catch (err) {
            setError((err.response && err.response.data && err.response.data.message) || 'Registration failed');
        }

        setLoading(false);
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.card } >
        <
        h2 style = { styles.title } > Create account < /h2> {
        error && < div style = { styles.error } > { error } < /div>} <
        form onSubmit = { handleSubmit } >
        <
        input style = { styles.input }
        name = "name"
        placeholder = "Full name"
        value = { form.name }
        onChange = { handleChange }
        required / >
        <
        input style = { styles.input }
        name = "email"
        type = "email"
        placeholder = "Email"
        value = { form.email }
        onChange = { handleChange }
        required / >
        <
        input style = { styles.input }
        name = "password"
        type = "password"
        placeholder = "Password"
        value = { form.password }
        onChange = { handleChange }
        required / >
        <
        input style = { styles.input }
        name = "phone"
        placeholder = "Phone number"
        value = { form.phone }
        onChange = { handleChange }
        /> <
        select style = { styles.input }
        name = "role"
        value = { form.role }
        onChange = { handleChange } >
        <
        option value = "customer" > Customer < /option> <
        option value = "restaurant_owner" > Restaurant Owner < /option> <
        option value = "delivery_partner" > Delivery Partner < /option> < /
        select > <
        button style = { styles.btn }
        type = "submit"
        disabled = { loading } > { loading ? 'Creating account...' : 'Sign Up' } < /button> < /
        form > <
        p style = { styles.footer } > Already have an account ? < Link to = "/login" > Login < /Link></p >
        <
        /div> < /
        div >
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

export default Register;