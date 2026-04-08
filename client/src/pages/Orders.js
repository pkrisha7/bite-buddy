import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetch = async() => {
            try {
                const res = await api.get('/orders/myorders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetch();
    }, [user, navigate]);

    const statusColor = { placed: '#f4a61e', confirmed: '#2196f3', preparing: '#ff9800', out_for_delivery: '#9c27b0', delivered: '#4caf50' };

    if (loading) return <div style = {
        { textAlign: 'center', padding: '40px' } } > Loading... < /div>;

    return ( <
        div style = { styles.container } >
        <
        h2 style = { styles.title } > My Orders < /h2> {
            orders.length === 0 ? ( <
                div style = { styles.empty } >
                <
                p > No orders yet! < /p> <
                button style = { styles.browseBtn }
                onClick = {
                    () => navigate('/') } > Order Now < /button> <
                /div>
            ) : orders.map(order => ( <
                div key = { order._id }
                style = { styles.card } >
                <
                div style = { styles.cardHeader } >
                <
                div >
                <
                h3 style = { styles.restName } > { order.restaurant && order.restaurant.name } < /h3> <
                p style = { styles.date } > { new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } < /p> <
                /div> <
                span style = {
                    {...styles.badge, backgroundColor: statusColor[order.status] + '20', color: statusColor[order.status] } } > { order.status.replace('_', ' ').toUpperCase() } <
                /span> <
                /div> <
                div style = { styles.items } > {
                    order.items.map((item, i) => ( <
                        div key = { i }
                        style = { styles.item } >
                        <
                        span > { item.name }× { item.quantity } < /span> <
                        span > ₹{ item.price * item.quantity } < /span> <
                        /div>
                    ))
                } <
                /div> <
                div style = { styles.cardFooter } >
                <
                span style = { styles.total } > Total: ₹{ order.totalAmount } < /span> <
                div style = {
                    { display: 'flex', gap: '8px', alignItems: 'center' } } >
                <
                span style = { order.isPaid ? styles.paid : styles.unpaid } > { order.isPaid ? 'Paid' : 'Unpaid' } < /span> <
                Link to = { `/track/${order._id}` }
                style = { styles.trackBtn } > Track Order < /Link> <
                /div> <
                /div> <
                /div>
            ))
        } <
        /div>
    );
};

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '24px 20px' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#222' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    restName: { fontSize: '17px', fontWeight: '600', color: '#222', marginBottom: '4px' },
    date: { fontSize: '13px', color: '#888' },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    items: { borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '12px 0', marginBottom: '12px' },
    item: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', padding: '3px 0' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    total: { fontSize: '16px', fontWeight: '600', color: '#222' },
    paid: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' },
    unpaid: { backgroundColor: '#fce8e8', color: '#c62828', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' },
    trackBtn: { backgroundColor: '#ff6b35', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', textDecoration: 'none' },
    empty: { textAlign: 'center', padding: '40px' },
    browseBtn: { marginTop: '16px', padding: '12px 24px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
};

export default Orders;