import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';

function App() {
    return ( <
        BrowserRouter >
        <
        AuthProvider >
        <
        CartProvider >
        <
        Navbar / >
        <
        Routes >
        <
        Route path = "/track/:orderId"
        element = { < OrderTracking / > }
        /> <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/restaurant/:id"
        element = { < RestaurantDetail / > }
        /> <
        Route path = "/cart"
        element = { < Cart / > }
        /> <
        Route path = "/orders"
        element = { < Orders / > }
        /> < /
        Routes > <
        /CartProvider> < /
        AuthProvider > <
        /BrowserRouter>
    );
}

export default App;