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
- **Bi-Directional Request Management**: Active "Incoming" and "Outgoing" tabs to manage both received invitations and pending sent requests.
- **Request Withdrawal**: Instant "Unsend" capability for pending invitations to maintain discovery control.
- **Optimized Pagination**: High-performance data segmentation for Feed, Connections, and Request lists to ensure smooth scaling.

### 🏆 Master Portfolio & Technical CV
- **Dedicated Professional Identity**: Independent `/portfolio` route providing a high-impact, full-screen technical CV.
- **Real-Time Activity Pulse**: Integrated **GitHub** and **LeetCode** activity heatmaps (contribution calendars) for instant technical proof.
- **Custom GraphQL Proxy**: High-performance backend proxy (`/api/leetcode`) to fetch LeetCode data securely and bypass CORS restrictions.
- **Dynamic Identity Linking**: Automated social reels for LinkedIn, LeetCode, GitHub, and Personal Portfolios that update in real-time.
- **Professional Headline Engine**: Dynamic role-based headlines (e.g., "Frontend Architect", "Cloud Engineer") that sync across the global feed and CV.
- **Aesthetic Branding**: Premium glassmorphic design system using the "Elite Developer" dark-mode palette.

### 💬 Real-Time Communication (High-Performance Engine)
- **WhatsApp-Style Optimistic UI**: Messages appear instantly (under 50ms) in the sender's UI. The system reconciles the local state with the server via Socket.io acknowledgments.
- **Reverse Infinite Scroll**: High-performance "load-more" logic for legacy messages using a "Sentinel" Observer. 
- **Cursor-Based Pagination**: Uses `_id` cursors to fetch 20 messages at a time, ensuring the initial chat load is always < 200ms regardless of history size.
- **Persistent Message Store**: De-embedded collection architecture for messages to bypass MongoDB's 16MB document limit and ensure infinite scalability.
- **Visual Status Tracking**: Real-time "Pending", "Sent", and "Error" indicators for every message.
- **Rich Media Support**: Integrated image messaging with direct-to-cloud signed uploads.
- **Device Camera Integration**: Supports standard media picker for instant photo sharing and gallery selection.
- **Direct-to-Cloud Architecture**: Frontend uploads media directly to Cloudinary using secure backend signatures, bypassing the main server for massive scalability.

### 👑 Premium Membership (Monetization)
- **Tiered Plans**: Silver and Gold membership tiers with exclusive benefits.
- **Razorpay Integration**: Fully functional, secure payment gateway for membership upgrades.
- **Elite Badges**: Visual premium indicators for verified power users.

### 🔐 Security & Reliability
- **Multi-Layered Rate Limiting**: Redis-backed protection against DDoS, brute-force (Auth), and email spam (OTP).
- **Resend SDK Integration**: Scalable, high-performance email delivery using the Resend SDK (HTTP-based) for maximum reliability in cloud environments.
- **Auto-Triggered Login OTP**: Smart authentication flow that automatically sends a fresh OTP if an unverified user attempts to log in.
- **Secure Password Recovery**: Expirable reset links handled via Redis for maximum security.
- **CORS Protection**: Strict cross-origin resource sharing policies.
- **Session-Based Auth**: Secure authentication using cookies (`withCredentials: true`).
- **Validation Layers**: Robust client-side and server-side input validation for all critical payloads.
- **Cloudinary Integration**: Fully automated, high-performance cloud storage for developer profile photos and chat media.
- **Smart Image Compression**: Client-side optimization using `browser-image-compression` (< 500KB) for both profile photos and chat attachments to ensure ultra-fast uploads.
- **Social OAuth 2.0 Integration**: One-click registration and login via Google and GitHub, powered by Passport.js.
- **Smart Account Linking**: Automatically merges social logins with existing accounts if the email addresses match.
- **Cross-Domain Token Exchange**: Production-safe OAuth flow using a dedicated token exchange endpoint, solving third-party cookie restrictions between Vercel and Render.


---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (v19)
- **Performance**: Route-based **Lazy Loading** (Code Splitting) and **Suspense** for instant initial bundles.
- **State Management**: Redux Toolkit & RTK Query (with custom cache merging for infinite scroll).
- **Styling**: Tailwind CSS v4 & DaisyUI (Custom Premium Theme).
- **Asset Optimization**: Immutable caching and production-grade routing via `vercel.json`.
- **HTTP Client**: Axios (Interceptors for credentials).
- **Image Processing**: browser-image-compression (Smart max 300KB client-side optimization).

### Backend
- **Engine**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache & Security**: Upstash Redis (OTP storage & Speed-limiting)
- **Real-Time**: Socket.io (Namespaced rooms for individual chats)
- **Email**: Resend (HTTP SDK for transactional delivery)
- **Verified Domain**: `support.nirajkr26.in` (Professional branding)
- **Authentication**: JWT, Cookie-Parser, and Passport.js (Google & GitHub Strategies)
- **Payments**: Razorpay Node SDK
- **Cloud Storage**: Cloudinary (Image management & transformations)
- **File Uploads**: Multer (Memory-buffer optimized processing)


---

## 📁 System Architecture

### Backend Directory Structure
```bash
backend/src/
├── models/         # Mongoose Schemas (User, Chat, ConnectionRequest, Payment)
├── routes/         # Express API Endpoints (Auth, Profile, Requests, Chat, Payment)
├── config/         # Database, Socket, and Cloudinary configurations
├── middlewares/    # Custom auth, validation, and Multer file upload filters
├── utils/          # Validation, socket.js logic, and constants
└── app.js          # Main entry point
```

### Frontend Directory Structure (Feature Folder Architecture)
```bash
frontend/src/
├── features/       # Domain-driven modules (Auth, Chat, Feed, Connections, Requests, Profile)
│   ├── auth/       # Hooks and isolated UI components for authentication
│   ├── chat/       # Complex RTK logic and optimistic UI chat components
│   ├── feed/       # Swiping and networking discovery hooks
│   ├── profile/    # Master Portfolio, LeetCode & GitHub Activity Pulses
│   └── requests/   # Request management and tab/pagination logic
├── components/     # Global, generic UI pieces and layouts
├── pages/          # Thin Layout Wrappers integrating feature components
├── utils/          # Redux Slices, API constants, and Socket logic
└── App.jsx         # Application routing matrix
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.x or higher) **or** Docker & Docker Compose
- MongoDB Atlas Account
- Razorpay, Cloudinary, Resend, and Upstash Redis credentials

### Installation (Local Development)

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
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   RESEND_API_KEY=your_resend_api_key
   RAZORPAY_KEY_ID=your_razorpay_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   FRONTEND_URL=your_frontend_url
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   GITHUB_CLIENT_ID=your_github_id
   GITHUB_CLIENT_SECRET=your_github_secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start        # production
   # or
   npm run dev      # development with nodemon
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev      # development server (Vite)
   ```

---

## 🐳 Docker Setup

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- `backend/.env` file configured (same as above)

### Run Backend Only
```bash
# Build the image
docker build -t devmatch-backend ./backend

# Run the container (loads env from file)
docker run -d \
  --name devmatch-backend \
  -p 3000:3000 \
  --env-file ./backend/.env \
  devmatch-backend
```

### Run Frontend Only
```bash
# Build the image (pass your backend URL at build time)
docker build \
  --build-arg VITE_BACKEND_URL=https://your-backend-url.com \
  -t devmatch-frontend ./frontend

# Run the container
docker run -d \
  --name devmatch-frontend \
  -p 80:80 \
  devmatch-frontend
```
> The frontend is served by Nginx on port `80` with SPA routing fully configured.

### Run Both with Docker Compose ⚡ (Recommended)
```bash
# In the project root, set the backend URL for the frontend build
VITE_BACKEND_URL=http://localhost:3000 docker compose up --build -d
```
This will:
1. Build and start the **backend** on port `3000`
2. Wait for the backend to pass its `/health` check
3. Build and start the **frontend** on port `80`, with the backend URL baked in

**Useful Compose Commands:**
```bash
docker compose logs -f           # Stream logs for all services
docker compose logs -f backend   # Stream backend logs only
docker compose down              # Stop and remove containers
docker compose down --volumes    # Stop and remove containers + volumes
```

---

## 🛡️ API Endpoints Summary

## 🛡️ API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/signup` | Register - Triggers 6-digit OTP email |
| **POST** | `/api/verify-otp` | Verify account or activate session |
| **POST** | `/api/resend-otp` | Throttle-protected fresh OTP dispatch |
| **POST** | `/api/login` | Authenticate (Smart Flow: triggers new OTP if unverified) |
| **POST** | `/api/logout` | Terminate session and clear cookies |
| **POST** | `/api/forgot-password` | Initiate recovery with secure reset link |
| **POST** | `/api/reset-password` | Update credentials via valid reset token |
| **GET** | `/api/auth/google` | Initiate Google OAuth flow |
| **GET** | `/api/auth/google/callback` | Google OAuth redirect handler |
| **GET** | `/api/auth/github` | Initiate GitHub OAuth flow |
| **GET** | `/api/auth/github/callback` | GitHub OAuth redirect handler |
| **POST** | `/api/auth/social/exchange` | Exchange token for httpOnly cookie (cross-domain) |


### 👤 Profile Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/profile/view` | Fetch current user's profile data |
| **PATCH** | `/api/profile/edit` | Update profile fields (bio, photo, skills) |
| **POST** | `/api/profile/upload` | Upload & compress profile photo to Cloudinary |
| **PATCH** | `/api/profile/password` | Securely update account password |

### 🤝 Connection System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/feed` | Get non-interacted developers for discovery |
| **GET** | `/api/user/requests/received` | Fetch pending incoming requests (Paginated) |
| **GET** | `/api/user/requests/sent` | Fetch pending outgoing requests (Paginated) |
| **GET** | `/api/user/connections` | List all accepted professional connections |
| **POST** | `/api/request/send/:status/:toUserId` | Send request (status: `interested` / `ignored`) |
| **POST** | `/api/request/review/:status/:id` | Review pending request (status: `accepted` / `rejected`) |
| **DELETE** | `/api/request/withdraw/:id` | Withdraw / Unsend a pending sent request |

### 💬 Messaging & Technical Pulse
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/chat/:targetUserId` | Fetch message history (Supports `?before=` cursor for infinite scroll) |
| **POST** | `/api/chat/sign-upload` | Generate secure HMAC signature for direct media uploads |
| **POST** | `/api/leetcode` | GraphQL Proxy to fetch real-time LeetCode submissions & activity |

### 💳 Payments & Premium
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/payment/create` | Initialize Razorpay order for Silver/Gold |
| **POST** | `/api/payment/verify` | Server-side signature verification of payment |

### 🏥 System Status
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Live system and DB connectivity report |


---

## 👨‍💻 Project Maintainer
**Niraj Kumar**  
*Full Stack Developer & Architect*

- [GitHub](https://github.com/nirajkr26)
- [LinkedIn](https://www.linkedin.com/in/niraj-kumar-5b1b44222/)

---

> [!TIP]
> **devMatch** uses a "Live Feed View" preview system in the Profile editor. Ensure your browser allows cookies from the backend domain to maintain the real-time session!
