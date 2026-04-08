import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, total, clearCart, restaurantId } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');

    if (cartItems.length === 0) return ( <
        div style = { styles.empty } >
        <
        h2 > Your cart is empty < /h2> <
        button style = { styles.browseBtn }
        onClick = {
            () => navigate('/') } > Browse restaurants < /button> <
        /div>
    );

    const handlePayment = async() => {
        if (!user) { navigate('/login'); return; }
        if (!address.trim()) { alert('Please enter delivery address'); return; }
        setLoading(true);
        try {
            const orderData = {
                restaurantId,
                items: cartItems.map(i => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity })),
                totalAmount: total,
                deliveryAddress: address,
            };

            const res = await api.post('/orders', orderData);
            const { razorpayOrderId, amount, currency, keyId, order } = res.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: 'Bite Buddy',
                description: 'Food Order Payment',
                order_id: razorpayOrderId,
                handler: async(response) => {
                    try {
                        await api.post('/orders/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: order._id,
                        });
                        clearCart();
                        alert('Payment successful! Your order has been placed.');
                        navigate('/orders');
                    } catch (err) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: '#ff6b35' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to create order. Please try again.');
        }
        setLoading(false);
    };

    return ( <
        div style = { styles.container } >
        <
        h2 style = { styles.title } > Your Cart < /h2> <
        div style = { styles.items } > {
            cartItems.map(item => ( <
                div key = { item._id }
                style = { styles.item } >
                <
                div style = { styles.itemInfo } >
                <
                h3 style = { styles.itemName } > { item.name } < /h3> <
                p style = { styles.itemPrice } > ₹{ item.price }
                each < /p> <
                /div> <
                div style = { styles.controls } >
                <
                button style = { styles.qtyBtn }
                onClick = {
                    () => updateQuantity(item._id, item.quantity - 1) } > - < /button> <
                span style = { styles.qty } > { item.quantity } < /span> <
                button style = { styles.qtyBtn }
                onClick = {
                    () => updateQuantity(item._id, item.quantity + 1) } > + < /button> <
                span style = { styles.itemTotal } > ₹{ item.price * item.quantity } < /span> <
                button style = { styles.removeBtn }
                onClick = {
                    () => removeFromCart(item._id) } > ✕ < /button> <
                /div> <
                /div>
            ))
        } <
        /div> <
        div style = { styles.summary } >
        <
        input style = { styles.addressInput }
        placeholder = "Enter delivery address"
        value = { address }
        onChange = { e => setAddress(e.target.value) }
        /> <
        div style = { styles.totalRow } >
        <
        span > Total < /span> <
        span style = { styles.totalAmt } > ₹{ total } < /span> <
        /div> <
        button style = { styles.checkoutBtn }
        onClick = { handlePayment }
        disabled = { loading } > { loading ? 'Processing...' : 'Proceed to Payment' } <
        /button> <
        button style = { styles.clearBtn }
        onClick = { clearCart } > Clear Cart < /button> <
        /div> <
        /div>
    );
};

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '24px 20px' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#222' },
    items: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' },
    item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '16px', fontWeight: '500', color: '#222', marginBottom: '4px' },
    itemPrice: { fontSize: '13px', color: '#888' },
    controls: { display: 'flex', alignItems: 'center', gap: '8px' },
    qtyBtn: { width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '16px' },
    qty: { fontSize: '16px', fontWeight: '500', minWidth: '20px', textAlign: 'center' },
    itemTotal: { fontSize: '15px', fontWeight: '600', color: '#ff6b35', minWidth: '50px', textAlign: 'right' },
    removeBtn: { backgroundColor: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '14px', padding: '4px' },
    summary: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    addressInput: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
    totalAmt: { color: '#ff6b35' },
    checkoutBtn: { width: '100%', padding: '14px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '500', marginBottom: '10px' },
    clearBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '60px 20px' },
    browseBtn: { marginTop: '16px', padding: '12px 24px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
};

export default Cart;