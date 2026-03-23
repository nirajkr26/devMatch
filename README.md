# devMatch 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**devMatch** is a premium, high-performance networking platform designed specifically for developers. It combines the intuitive "swipe-to-match" discovery model with a robust professional ecosystem, enabling engineers to find co-builders, mentors, and collaborators with clinical precision.

---

## ✨ Key Features

### 📡 Real-Time Professional Networking
- **Algorithmic Discovery (Feed)**: A Tinder-inspired discovery engine where developers can view profiles, tech stacks, and "Pass" or "Connect" in one click.
- **Dynamic User Cards**: Rich profile visualizations featuring bios, tech expertise, and professional experience.

### 💬 Real-Time Communication
- **Socket.io Integration**: Low-latency, real-time messaging powered by WebSockets.
- **Persistent Chat History**: Securely stored conversations that load instantly.
- **Active Status Indicators**: Real-time status updates for peer-to-peer interactions.

### 👑 Premium Membership (Monetization)
- **Tiered Plans**: Silver and Gold membership tiers with exclusive benefits.
- **Razorpay Integration**: Fully functional, secure payment gateway for membership upgrades.
- **Elite Badges**: Visual premium indicators for verified power users.

### 🔐 Security & Reliability
- **Multi-Layered Rate Limiting**: Redis-backed protection against DDoS, brute-force (Auth), and email spam (OTP).
- **Email OTP Verification**: Mandatory verification for new accounts using Nodemailer with branded templates.
- **Secure Password Recovery**: Expirable reset links handled via Redis for maximum security.
- **CORS Protection**: Strict cross-origin resource sharing policies.
- **Session-Based Auth**: Secure authentication using cookies (`withCredentials: true`).
- **Validation Layers**: Robust client-side and server-side input validation for all critical payloads.


---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit (Slices for Users, Feed, Connections, and Requests)
- **Styling**: Tailwind CSS & DaisyUI (Custom Premium Theme)
- **Icons**: Lucide React / SVG Icons
- **HTTP Client**: Axios (Interceptors for credentials)

### Backend
- **Engine**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache & Security**: Upstash Redis (OTP storage & Speed-limiting)
- **Real-Time**: Socket.io (Namespaced rooms for individual chats)
- **Email**: Nodemailer (Gmail SMTP with App Passwords)
- **Authentication**: JWT & Cookie-Parser
- **Payments**: Razorpay Node SDK


---

## 📁 System Architecture

### Backend Directory Structure
```bash
backend/src/
├── models/         # Mongoose Schemas (User, Chat, ConnectionRequest, Payment)
├── routes/         # Express API Endpoints (Auth, Profile, Requests, Chat, Payment)
├── config/         # Database & Socket configurations
├── utils/          # Validation, socket.js logic, and constants
└── app.js          # Main entry point
```

### Frontend Directory Structure
```bash
frontend/src/
├── components/     # Reusable UI (Navbar, Card, Footer, EditProfile)
├── pages/          # View Components (Landing, Feed, Connections, Chat, Premium)
├── utils/          # Redux Slices, Constants, and Socket connection logic
└── App.jsx         # Routing & Page Layout
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas Account / Local Instance
- Razorpay API Keys (for payment testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nirajkr26/devMatch.git
   cd devMatch
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   REDIS_URL=your_upstash_redis_url
   JWT_SECRET=your_jwt_secret
   REDIS_URL=your_redis_url
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   FRONTEND_URL=http://localhost:5173
   ```


3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡️ API Endpoints Summary

## 🛡️ API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/signup` | Register - Triggers 6-digit OTP email |
| **POST** | `/verify-otp` | Verify account or activate session |
| **POST** | `/resend-otp` | Throttle-protected fresh OTP dispatch |
| **POST** | `/login` | Authenticate (Includes auto-OTP if unverified) |
| **POST** | `/logout` | Terminate session and clear cookies |
| **POST** | `/forgot-password` | Initiate recovery with secure reset link |
| **POST** | `/reset-password` | Update credentials via valid reset token |


### 👤 Profile Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/profile/view` | Fetch current user's profile data |
| **PATCH** | `/profile/edit` | Update profile fields (bio, photo, skills) |
| **PATCH** | `/profile/password` | Securely update account password |

### 🤝 Connection System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/feed` | Get non-interacted developers for discovery |
| **GET** | `/user/requests/received` | Fetch all pending incoming requests |
| **GET** | `/user/connections` | List all accepted professional connections |
| **POST** | `/request/send/:status/:toUserId` | Send request (status: `interested` / `ignored`) |
| **POST** | `/request/review/:status/:id` | Review pending request (status: `accepted` / `rejected`) |

### 💬 Messaging
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/chat/:targetUserId` | Fetch full message history with a connection |

### 💳 Payments & Premium
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/payment/create` | Initialize Razorpay order for Silver/Gold |
| **POST** | `/payment/verify` | Server-side signature verification of payment |

### 🏥 System Status
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Live system and DB connectivity report |


---

## 👨‍💻 Project Maintainer
**Niraj Kumar**  
*Full Stack Developer & Architect*

- [GitHub](https://github.com/nirajkr26)
- [LinkedIn](https://www.linkedin.com/in/niraj-kumar-5b1b44222/)

---

> [!TIP]
> **devMatch** uses a "Live Feed View" preview system in the Profile editor. Ensure your browser allows cookies from the backend domain to maintain the real-time session!
