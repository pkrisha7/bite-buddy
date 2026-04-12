# 🍔 Bite Buddy — Smart Food Delivery App

A full-stack food delivery web application built with the MERN stack, featuring real-time order tracking, Razorpay payment integration, and live delivery simulation on an interactive map.

> Built as a portfolio project targeting software development roles. Demonstrates high-traffic app patterns with payments, WebSockets, and real-time features — exactly what startups ask about.

---

## 🌐 Live Demo

- **Frontend:** https://bite-buddy.vercel.app
- **Backend API:** https://vercel.com/pkrisha7s-projects/bite-buddy-1msz/AjNpf35nVTorxRyJh8cjCg1YrKuJ

---

## ✨ Features

- 🔐 JWT Authentication with role-based access (customer / restaurant owner / delivery partner)
- 🍽️ Restaurant listings with search and cuisine filter
- 📋 Menu browsing with food images per restaurant
- 🛒 Live cart with quantity management and cross-restaurant conflict handling
- 💳 Razorpay payment integration with webhook signature verification
- 📦 Order placement and history tracking
- 🔴 Real-time order status updates via Socket.io rooms
- 🗺️ Live delivery partner tracking on interactive Leaflet map (OpenStreetMap)
- 🛵 Delivery simulation with GPS coordinate broadcasting
- 📱 Responsive UI built with React

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Socket.io-client | Real-time communication |
| Leaflet.js + React-Leaflet | Interactive maps |
| Context API | Global state (auth + cart) |

### Backend
| Technology | Usage |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Socket.io | WebSocket server |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Razorpay SDK | Payment processing |
| crypto (Node built-in) | Payment signature verification |

### Deployment
| Service | Usage |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

