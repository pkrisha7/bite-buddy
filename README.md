# Bite Buddy 

A full-stack food delivery app built with the MERN stack, featuring real-time order tracking, Razorpay payments, and live delivery simulation.

## Features
- Restaurant listings with search and cuisine filter
- Menu browsing with food images
- Live cart with quantity management
- Razorpay payment integration (test mode)
- Real-time order status updates via Socket.io
- Live delivery partner tracking on Leaflet map
- JWT authentication with role-based access
- Order history with status tracking

## Tech Stack
**Frontend:** React, React Router, Axios, Socket.io-client, Leaflet.js

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io

**Integrations:** Razorpay (payments), OpenStreetMap (maps), JWT (auth), bcrypt (password hashing)

## Architecture
- REST API for auth, restaurants, orders
- WebSocket rooms for real-time order updates
- Payment verification via Razorpay signature matching
- Delivery simulation with coordinate broadcasting



### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Razorpay test account

### Backend Setup
```bash
cd server
npm install
```
Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```


- Implemented idempotent payment flow using Razorpay webhook signature verification
- Used Socket.io rooms to broadcast order status only to relevant clients
- Handled cross-restaurant cart conflicts with user confirmation
- JWT middleware for role-based route protection


## Author
Krisha Pokharel