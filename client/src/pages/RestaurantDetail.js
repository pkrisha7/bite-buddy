import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const RestaurantDetail = () => {
        const { id } = useParams();
        const [restaurant, setRestaurant] = useState(null);
        const [menuItems, setMenuItems] = useState([]);
        const [loading, setLoading] = useState(true);
        const { addToCart, cartItems } = useCart();

        useEffect(() => {
            const fetch = async() => {
                const res = await api.get(`/restaurants/${id}`);
                setRestaurant(res.data.restaurant);
                setMenuItems(res.data.menuItems);
                setLoading(false);
            };
            fetch();
        }, [id]);

        if (loading) return <div style = { styles.center } > Loading... < /div>;

        return ( <
                div style = { styles.container } >
                <
                div style = { styles.header } > {
                    restaurant.image && < img src = { restaurant.image }
                    alt = { restaurant.name }
                    style = { styles.headerImg }
                    />} <
                    h1 style = { styles.name } > { restaurant.name } < /h1> <
                    p style = { styles.cuisine } > { restaurant.cuisine }• { restaurant.address } < /p> <
                    span style = { styles.rating } > ★{ restaurant.rating || 'New' } < /span> <
                    /div> <
                    h2 style = { styles.menuTitle } > Menu < /h2> {
                        menuItems.length === 0 ? ( <
                                p style = { styles.empty } > No menu items yet. < /p>
                            ) : ( <
                                div style = { styles.grid } > {
                                    menuItems.map(item => {
                                            const inCart = cartItems.find(i => i._id === item._id);
                                            return ( <
                                                div key = { item._id }
                                                style = { styles.card } > {
                                                    item.image && < img src = { item.image }
                                                    alt = { item.name }
                                                    style = { styles.itemImg }
                                                    />} <
                                                    div style = { styles.cardInfo } >
                                                    <
                                                    h3 style = { styles.itemName } > { item.name } < /h3> <
                                                    p style = { styles.itemDesc } > { item.description } < /p> <
                                                    p style = { styles.price } > ₹{ item.price } < /p> <
                                                    /div> <
                                                    button
                                                    style = { inCart ? styles.addedBtn : styles.addBtn }
                                                    onClick = {
                                                        () => addToCart(item, id) } >
                                                    { inCart ? `In cart (${inCart.quantity})` : '+ Add' } <
                                                    /button> <
                                                    /div>
                                                );
                                            })
                                    } <
                                    /div>
                                )
                            } <
                            /div>
                    );
                };

                const styles = {
                    container: { maxWidth: '900px', margin: '0 auto', padding: '24px 20px' },
                    center: { textAlign: 'center', padding: '40px' },
                    header: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
                    headerImg: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' },
                    name: { fontSize: '28px', fontWeight: 'bold', color: '#222', marginBottom: '8px' },
                    cuisine: { color: '#666', marginBottom: '8px' },
                    rating: { color: '#f4a61e' },
                    menuTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' },
                    grid: { display: 'flex', flexDirection: 'column', gap: '12px' },
                    card: { backgroundColor: 'white', padding: '16px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
                    itemImg: { width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
                    cardInfo: { flex: 1 },
                    itemName: { fontSize: '16px', fontWeight: '600', color: '#222', marginBottom: '4px' },
                    itemDesc: { fontSize: '13px', color: '#888', marginBottom: '6px' },
                    price: { fontSize: '16px', fontWeight: '600', color: '#ff6b35' },
                    addBtn: { backgroundColor: '#ff6b35', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' },
                    addedBtn: { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' },
                    empty: { color: '#888', textAlign: 'center', padding: '40px' },
                };

                export default RestaurantDetail;