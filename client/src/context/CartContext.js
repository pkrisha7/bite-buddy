import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    const addToCart = (item, restId) => {
        if (restaurantId && restaurantId !== restId) {
            if (!window.confirm('Your cart has items from another restaurant. Clear cart and add new item?')) return;
            setCartItems([]);
        }
        setRestaurantId(restId);
        setCartItems(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) return prev.map(i => i._id === item._id ? {...i, quantity: i.quantity + 1 } : i);
            return [...prev, {...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(i => i._id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return removeFromCart(itemId);
        setCartItems(prev => prev.map(i => i._id === itemId ? {...i, quantity } : i));
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurantId(null);
    };

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return ( <
        CartContext.Provider value = {
            { cartItems, restaurantId, addToCart, removeFromCart, updateQuantity, clearCart, total } } > { children } <
        /CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);