# 🍔 Bite Buddy — Smart Food Delivery Platform

> A full-stack food delivery web application built with the MERN stack, featuring real-time order tracking, secure payment processing, and live GPS delivery simulation.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-brightgreen)](https://bite-buddy-1msz.vercel.app)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

Bite Buddy is a production-ready food delivery platform that connects **customers**, **restaurant owners**, and **delivery partners** through a single, unified system. The platform handles everything from menu browsing and order placement to real-time delivery tracking on an interactive map.

---

## ✨ Features

### 👤 For Customers
- Browse restaurants with search and cuisine filters
- View menus with food images per restaurant
- Smart cart with quantity management and cross-restaurant conflict handling
- Secure checkout via **Razorpay** payment gateway
- Real-time order status updates
- Live delivery partner tracking on an interactive map

### 🍽️ For Restaurant Owners
- Dashboard to manage incoming orders
- Accept / reject orders in real time
- Menu and listing management

### 🛵 For Delivery Partners
- Accept delivery assignments
- GPS coordinate broadcasting for live tracking
- Delivery simulation via Leaflet.js + Socket.io

### 🔐 Security
- JWT-based authentication with **role-based access control** (customer / restaurant / delivery)
- Razorpay **webhook signature verification** using Node.js `crypto` module
- bcrypt password hashing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-time** | Socket.io (WebSockets) |
| **Maps** | Leaflet.js + React-Leaflet (OpenStreetMap) |
| **Payments** | Razorpay SDK + Webhook verification |
| **Auth** | JWT, bcryptjs |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 🗂️ Project Structure

```
bite-buddy/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Cart context (global state)
│   │   ├── pages/           # Route-level pages
│   │   └── utils/           # Axios config, helpers
│   └── package.json
│
└── server/                  # Node.js + Express backend
    ├── models/              # Mongoose schemas (User, Restaurant, Order)
    ├── routes/              # API route handlers
    ├── middleware/           # JWT auth middleware
    ├── controllers/         # Business logic
    └── server.js            # Entry point + Socket.io setup
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payment keys)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pkrisha7/bite-buddy
cd bite-buddy

# 2. Setup backend
cd server
npm install

# Create .env file
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

npm start

# 3. Setup frontend (new terminal)
cd ../client
npm install
npm run dev
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Restaurants
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants/:id/menu` | Get menu for a restaurant |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/:id` | Get order details |
| PATCH | `/api/orders/:id/status` | Update order status (restaurant/delivery) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create` | Initiate Razorpay payment |
| POST | `/api/payment/webhook` | Handle Razorpay webhook (signature verified) |

---

## 🚀 Deployment

| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend API hosting |
| **MongoDB Atlas** | Cloud database |

- **Frontend:** https://bite-buddy-1msz.vercel.app
- **Backend:** Hosted on Render (see frontend config for base URL)

---

## 🧠 Key Technical Decisions

- **Socket.io rooms** — Each order gets its own room so status updates are isolated and scalable.
- **Webhook signature verification** — Uses `crypto.createHmac` to validate Razorpay payloads, preventing payment spoofing.
- **Cart conflict handling** — Detects multi-restaurant selections and prompts user to clear cart, preventing invalid order states.
- **Context API over Redux** — Lightweight global state for auth and cart without the overhead of Redux.

---

## 👩‍💻 Author

**Krisha Pokharel**
- GitHub: [@pkrisha7](https://github.com/pkrisha7)
- LinkedIn: [Krisha Pokharel](https://linkedin.com/in/)
