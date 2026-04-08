import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const driverIcon = new L.DivIcon({
    html: '<div style="font-size:28px">🛵</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const restaurantIcon = new L.DivIcon({
    html: '<div style="font-size:28px">🍽️</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const homeIcon = new L.DivIcon({
    html: '<div style="font-size:28px">🏠</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const socket = io('http://localhost:5000');

const STATUS_STEPS = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered'
};
const STATUS_ICONS = {
    placed: '📋',
    confirmed: '✅',
    preparing: '👨‍🍳',
    out_for_delivery: '🛵',
    delivered: '🎉'
};

// Bangalore route simulation points
const ROUTE_POINTS = [
    { lat: 12.9716, lng: 77.5946 },
    { lat: 12.9720, lng: 77.5960 },
    { lat: 12.9730, lng: 77.5975 },
    { lat: 12.9745, lng: 77.5990 },
    { lat: 12.9760, lng: 77.6005 },
    { lat: 12.9775, lng: 77.6015 },
    { lat: 12.9790, lng: 77.6020 },
    { lat: 12.9800, lng: 77.6025 },
];

const RESTAURANT_POS = { lat: 12.9716, lng: 77.5946 };
const DELIVERY_POS = { lat: 12.9800, lng: 77.6025 };

const MoveMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.panTo(position);
    }, [position, map]);
    return null;
};

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('confirmed');
    const [driverPos, setDriverPos] = useState(RESTAURANT_POS);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const routeIndexRef = useRef(0);
    const simIntervalRef = useRef(null);

    useEffect(() => {
        const fetchOrder = async() => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data);
                setStatus(res.data.status);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchOrder();

        socket.emit('join_order', orderId);
        socket.on('order_status_update', ({ status }) => setStatus(status));
        socket.on('driver_location_update', ({ lat, lng }) => setDriverPos({ lat, lng }));

        return () => {
            socket.off('order_status_update');
            socket.off('driver_location_update');
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        };
    }, [orderId]);

    const simulateDelivery = () => {
        if (simulating) return;
        setSimulating(true);
        routeIndexRef.current = 0;
        socket.emit('update_status', { orderId, status: 'out_for_delivery' });

        simIntervalRef.current = setInterval(() => {
            const idx = routeIndexRef.current;
            if (idx >= ROUTE_POINTS.length) {
                clearInterval(simIntervalRef.current);
                setSimulating(false);
                socket.emit('update_status', { orderId, status: 'delivered' });
                return;
            }
            const point = ROUTE_POINTS[idx];
            setDriverPos(point);
            socket.emit('driver_location', { orderId, lat: point.lat, lng: point.lng });
            routeIndexRef.current += 1;
        }, 1500);
    };

    const currentStep = STATUS_STEPS.indexOf(status);

    if (loading) return <div style = { styles.center } > Loading order... < /div>;

    return ( <
            div style = { styles.container } >
            <
            h2 style = { styles.title } > Track Your Order < /h2>

            <
            div style = { styles.statusCard } >
            <
            div style = { styles.statusSteps } > {
                STATUS_STEPS.map((step, index) => ( <
                        div key = { step }
                        style = { styles.stepWrapper } >
                        <
                        div style = {
                            {
                                ...styles.stepCircle,
                                    backgroundColor: index <= currentStep ? '#ff6b35' : '#e0e0e0',
                                    color: index <= currentStep ? 'white' : '#999',
                            }
                        } > { index <= currentStep ? '✓' : index + 1 } <
                        /div> <
                        div style = { styles.stepLabel } > { STATUS_LABELS[step] } < /div> {
                        index < STATUS_STEPS.length - 1 && ( <
                            div style = {
                                {
                                    ...styles.stepLine,
                                        backgroundColor: index < currentStep ? '#ff6b35' : '#e0e0e0',
                                }
                            }
                            />
                        )
                    } <
                    /div>
                ))
        } <
        /div> <
    div style = { styles.currentStatus } >
        <
        span style = { styles.statusIcon } > { STATUS_ICONS[status] } < /span> <
    div >
        <
        div style = { styles.statusText } > { STATUS_LABELS[status] } < /div> <
    div style = { styles.statusSub } > { status === 'placed' && 'Waiting for restaurant to confirm' } { status === 'confirmed' && 'Restaurant has confirmed your order' } { status === 'preparing' && 'Your food is being prepared' } { status === 'out_for_delivery' && 'Your order is on the way!' } { status === 'delivered' && 'Enjoy your meal!' } <
        /div> < /
        div > <
        /div> < /
        div >

        {
            order && ( <
                div style = { styles.orderCard } >
                <
                h3 style = { styles.orderTitle } > Order Details < /h3> {
                order.items.map((item, i) => ( <
                    div key = { i }
                    style = { styles.item } >
                    <
                    span > { item.name }× { item.quantity } < /span> <
                    span > ₹{ item.price * item.quantity } < /span> < /
                    div >
                ))
            } <
            div style = { styles.total } > Total: ₹{ order.totalAmount } < /div> <
            div style = { styles.address } > 📍{ order.deliveryAddress } < /div> < /
            div >
        )
}

<
div style = { styles.mapCard } >
    <
    h3 style = { styles.orderTitle } > Live Delivery Tracking < /h3> <
div style = { styles.mapLegend } >
    <
    span > 🍽️Restaurant < /span> <
span > 🛵Driver < /span> <
span > 🏠Your location < /span> < /
    div > <
    MapContainer center = {
        [12.9716, 77.5946]
    }
zoom = { 14 }
style = { styles.map }
zoomControl = { true } >
    <
    TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
attribution = '&copy; OpenStreetMap contributors' /
    >
    <
    Marker position = { RESTAURANT_POS }
icon = { restaurantIcon } >
    <
    Popup > Restaurant < /Popup> < /
    Marker > <
    Marker position = { DELIVERY_POS }
icon = { homeIcon } >
    <
    Popup > Delivery Location < /Popup> < /
    Marker > <
    Marker position = { driverPos }
icon = { driverIcon } >
    <
    Popup > Your delivery partner < /Popup> < /
    Marker > <
    MoveMap position = { driverPos }
/> < /
MapContainer > <
    /div>

<
div style = { styles.simulatorCard } >
    <
    h3 style = { styles.orderTitle } > Simulate Delivery(Demo) < /h3> <
p style = { styles.simNote } > Update order status or watch the driver move on the map! < /p> <
div style = { styles.simButtons } > {
        STATUS_STEPS.map(step => ( <
            button key = { step }
            style = {
                {
                    ...styles.simBtn,
                        backgroundColor: status === step ? '#ff6b35' : 'white',
                        color: status === step ? 'white' : '#ff6b35',
                }
            }
            onClick = {
                () => socket.emit('update_status', { orderId, status: step })
            } > { STATUS_LABELS[step] } <
            /button>
        ))
    } <
    /div> <
button style = { styles.driveBtn }
onClick = { simulateDelivery }
disabled = { simulating } > { simulating ? '🛵 Driver is on the way...' : '🛵 Simulate Driver Moving' } <
    /button> < /
    div > <
    /div>
);
};

const styles = {
    container: { maxWidth: '750px', margin: '0 auto', padding: '24px 20px' },
    center: { textAlign: 'center', padding: '40px' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#222' },
    statusCard: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    statusSteps: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' },
    stepWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
    stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', marginBottom: '8px', zIndex: 1 },
    stepLabel: { fontSize: '11px', color: '#666', textAlign: 'center', maxWidth: '60px' },
    stepLine: { position: 'absolute', top: '16px', left: '60%', right: '-40%', height: '2px', zIndex: 0 },
    currentStatus: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#fff8f5', padding: '16px', borderRadius: '10px' },
    statusIcon: { fontSize: '32px' },
    statusText: { fontSize: '18px', fontWeight: '600', color: '#222', marginBottom: '4px' },
    statusSub: { fontSize: '14px', color: '#666' },
    orderCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    orderTitle: { fontSize: '16px', fontWeight: '600', color: '#222', marginBottom: '12px' },
    item: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', padding: '4px 0' },
    total: { fontSize: '16px', fontWeight: '600', color: '#222', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' },
    address: { fontSize: '13px', color: '#888', marginTop: '8px' },
    mapCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    mapLegend: { display: 'flex', gap: '16px', fontSize: '13px', color: '#666', marginBottom: '12px' },
    map: { height: '350px', borderRadius: '8px', zIndex: 0 },
    simulatorCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '40px' },
    simNote: { fontSize: '13px', color: '#888', marginBottom: '12px' },
    simButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' },
    simBtn: { padding: '8px 14px', borderRadius: '8px', border: '1px solid #ff6b35', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    driveBtn: { width: '100%', padding: '12px', backgroundColor: '#222', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '500', marginTop: '8px' },
};

export default OrderTracking;