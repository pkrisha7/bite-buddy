import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRestaurants = async(query = '') => {
        try {
            const res = await api.get(`/restaurants?search=${query}`);
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchRestaurants(); }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchRestaurants(e.target.value);
    };

    return ( <
            div style = { styles.container } >
            <
            div style = { styles.hero } >
            <
            h1 style = { styles.heroTitle } > Food you love, delivered fast < /h1> <
            p style = { styles.heroSub } > Discover the best restaurants in Bangalore < /p> <
            input style = { styles.searchBar }
            placeholder = "Search restaurants..."
            value = { search }
            onChange = { handleSearch }
            /> < /
            div > <
            div style = { styles.grid } > {
                loading ? < p > Loading... < /p> : restaurants.length === 0 ? ( <
                p style = { styles.empty } > No restaurants found.Add some from the backend! < /p>
            ): restaurants.map(r => ( <
                Link to = { `/restaurant/${r._id}` }
                key = { r._id }
                style = { styles.card } >
                <
                div style = { styles.cardImg } > {
                    r.image ? < img src = { r.image }
                    alt = { r.name }
                    style = { styles.img }
                    /> : <div style={styles.placeholder}>{r.name[0]}</div >
                } < /div> <
                div style = { styles.cardBody } >
                <
                h3 style = { styles.cardTitle } > { r.name } < /h3> <
                p style = { styles.cardSub } > { r.cuisine } < /p> <
                p style = { styles.cardAddr } > { r.address } < /p> <
                div style = { styles.cardFooter } >
                <
                span style = { styles.rating } > ★{ r.rating || 'New' } < /span> <
                span style = { r.isOpen ? styles.open : styles.closed } > { r.isOpen ? 'Open' : 'Closed' } < /span> < /
                div > <
                /div> < /
                Link >
            ))
        } <
        /div> < /
    div >
);
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
    hero: { textAlign: 'center', padding: '48px 20px 32px', backgroundColor: '#fff8f5', margin: '0 -20px 32px', borderBottom: '1px solid #ffe0d0' },
    heroTitle: { fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' },
    heroSub: { color: '#666', marginBottom: '20px' },
    searchBar: { width: '100%', maxWidth: '480px', padding: '12px 20px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', paddingBottom: '40px' },
    card: { textDecoration: 'none', color: 'inherit', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' },
    cardImg: { height: '160px', overflow: 'hidden', backgroundColor: '#f0f0f0' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    placeholder: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#ff6b35', fontWeight: 'bold' },
    cardBody: { padding: '16px' },
    cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#222' },
    cardSub: { color: '#ff6b35', fontSize: '13px', marginBottom: '4px' },
    cardAddr: { color: '#888', fontSize: '13px', marginBottom: '8px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    rating: { color: '#f4a61e', fontSize: '14px' },
    open: { backgroundColor: '#e6f4ea', color: '#2e7d32', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
    closed: { backgroundColor: '#fce8e8', color: '#c62828', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
    empty: { color: '#888', gridColumn: '1/-1', textAlign: 'center', paddingTop: '40px' },
};

export default Home;