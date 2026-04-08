import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
        const { user, logout } = useAuth();
        const { cartItems } = useCart();
        const navigate = useNavigate();

        const handleLogout = () => {
            logout();
            navigate('/login');
        };

        return ( <
            nav style = { styles.nav } >
            <
            Link to = "/"
            style = { styles.logo } > Bite Buddy < /Link> <
            div style = { styles.links } > {
                user ? ( <
                    >
                    <
                    span style = { styles.welcome } > Hi, { user.name } < /span> <
                    Link to = "/orders"
                    style = { styles.link } > My Orders < /Link> <
                    Link to = "/cart"
                    style = { styles.cartBtn } >
                    Cart {
                        cartItems.length > 0 && < span style = { styles.badge } > { cartItems.length } < /span>} < /
                        Link > <
                            button onClick = { handleLogout }
                        style = { styles.logoutBtn } > Logout < /button> < / >
                    ): ( <
                        >
                        <
                        Link to = "/login"
                        style = { styles.link } > Login < /Link> <
                        Link to = "/register"
                        style = { styles.registerBtn } > Sign Up < /Link> < / >
                    )
                } <
                /div> < /
                nav >
            );
        };

        const styles = {
            nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: '#ff6b35', color: 'white', position: 'sticky', top: 0, zIndex: 100 },
            logo: { color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' },
            links: { display: 'flex', alignItems: 'center', gap: '16px' },
            link: { color: 'white', textDecoration: 'none', fontSize: '15px' },
            welcome: { fontSize: '14px', opacity: 0.9 },
            cartBtn: { color: 'white', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '15px', position: 'relative' },
            badge: { backgroundColor: 'white', color: '#ff6b35', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', fontWeight: 'bold', marginLeft: '4px' },
            registerBtn: { color: '#ff6b35', textDecoration: 'none', backgroundColor: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '15px', fontWeight: '500' },
            logoutBtn: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '15px' },
        };

        export default Navbar;