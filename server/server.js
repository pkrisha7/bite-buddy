const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => {
    res.json({ message: 'Food delivery API is running' });
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`Client joined order room: ${orderId}`);
    });

    socket.on('update_status', ({ orderId, status }) => {
        io.to(orderId).emit('order_status_update', { status });
        console.log(`Order ${orderId} status updated to ${status}`);
    });

    socket.on('driver_location', ({ orderId, lat, lng }) => {
        io.to(orderId).emit('driver_location_update', { lat, lng });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

if (!process.env.MONGO_URI) {
    console.error('CRITICAL WARNING: MONGO_URI is not defined in environment variables. Database features will fail.');
} else {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

module.exports = { io };