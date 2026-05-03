# 🤖 Virtual Assistant: Pro-Grade Voice AI Platform

A state-of-the-art, voice-activated virtual assistant platform built for performance and scalability. This project leverages the **MERN** stack and integrates **Groq's Llama 3.3-70b** model to provide a seamless, human-like interaction experience.

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/adityajha200108/virtual-assistant)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/adityajha200108/virtual-assistant/graphs/commit-activity)

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Installation & Setup](#-installation--setup)
- [Production Deployment](#-production-deployment)
- [Security & Optimization](#-security--optimization)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview
Virtual Assistant is not just a chatbot; it's a voice-first interface designed to bridge the gap between users and web services. By utilizing high-speed inference from Groq Cloud, the assistant processes complex natural language queries in milliseconds, making it suitable for real-time voice applications.

---

## ✨ Core Features

### 🎙️ Intelligent Voice System
- **Bi-directional Speech**: Full support for Speech-to-Text (STT) and Text-to-Speech (TTS).
- **Context Awareness**: Remembers your name and your custom assistant's personality.
- **Multilingual Foundation**: Optimized for English with intuitive support for Hindi/Hinglish instructions.

### 🧠 Advanced Intent Recognition
The AI engine categorizes user requests into actionable intents:
- **Search Intent**: Specialized logic for Google and YouTube queries.
- **Execution Intent**: Direct triggers for system functions (Time, Date).
- **Navigation Intent**: One-voice-command access to Facebook, Instagram, and more.
- **Computation Intent**: Built-in logic for weather and mathematical queries via search integration.

### 🎨 Personalization & UX
- **Custom Identities**: Users can name their AI and upload custom avatars (stored on Cloudinary).
- **Premium UI**: Built with glassmorphism principles, smooth transitions, and responsive design.
- **Real-time Transcripts**: Visual feedback while speaking to ensure accuracy.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Client-side)
- **Framework**: React 19 (Vite)
- **State Management**: Context API for global user and assistant state.
- **Styling**: Tailwind CSS 4.0 with customized color tokens.
- **APIs**: Web Speech API (Native Browser Support).

### Backend (Server-side)
- **Runtime**: Node.js with Express.js.
- **AI Inference**: Groq Cloud SDK / REST API (Llama 3.3-70b-versatile).
- **Database**: MongoDB Atlas for user profiles and conversation history.
- **File Storage**: Cloudinary for high-performance asset management.
- **Auth**: JWT (JSON Web Tokens) with Secure HTTP-only cookies.

---

## ⚙️ Environment Configuration

Create a `.env` file in the `/backend` directory.

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server listening port | `8000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for token signing | `your_ultra_secure_secret` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name | `ayusha23` |
| `CLOUDINARY_API_KEY` | Cloudinary API Public Key | `325432498548763` |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret Key | `UscgPDEABp...` |
| `GROQ_API_KEY` | Groq Cloud API Key | `gsk_2OvwSqen...` |

---

## 📡 API Documentation

### Auth Routes (`/api/auth`)
- `POST /signup`: Register a new user.
- `POST /signin`: Authenticate user and receive HTTP-only cookie.
- `GET /logout`: Clear session cookies.

### User Routes (`/api/user`)
- `GET /current`: Retrieve authenticated user profile.
- `POST /update`: Update assistant name and image (supports `multipart/form-data`).
- `POST /asktoassistant`: Core AI processing endpoint. Receives `command`, returns JSON intent and response.

---

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/adityajha200108/virtual-assistant.git
cd virtual-assistant

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2. Development Mode
```bash
# In /backend
npm run dev

# In /frontend
npm run dev
```

---

## 🚢 Production Deployment

### Backend Optimization
- Ensure `NODE_ENV=production`.
- Use a reverse proxy like **Nginx** for SSL termination.
- Recommendation: Deploy on **Render**, **Railway**, or **AWS EC2**.

### Frontend Deployment
- Build the optimized production bundle:
  ```bash
  cd frontend
  npm run build
  ```
- Deploy the `dist` folder to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🛡️ Security & Optimization

- **API Guarding**: Added `isProcessingRef` and cooldowns to the frontend to prevent API quota exhaustion (429 errors).
- **CORS Policy**: Configured to allow only specific origins in production.
- **Input Sanitization**: Backend regex patterns ensure clean JSON extraction from AI responses.
- **Secure Cookies**: JWTs are stored in `httpOnly` cookies to prevent XSS attacks.

---

## ❓ Troubleshooting

**Q: Speech recognition isn't working?**
- A: Ensure you are using a modern browser (Chrome/Edge) and have granted microphone permissions.

**Q: AI is not responding?**
- A: Check the `GROQ_API_KEY` in your `.env`. Verify the backend console for 429 (Rate Limit) or 401 (Auth) errors.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---

**Built by [Aditya Jha](https://github.com/adityajha200108)**
