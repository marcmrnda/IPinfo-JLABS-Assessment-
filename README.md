# JLabs - IP Geolocation Tracking Dashboard

A full-stack application for tracking and visualizing IP address geolocation data in real-time. Built with modern web technologies featuring user authentication, interactive maps, and IP history management.

![JLabs App](https://img.shields.io/badge/React-TypeScript-blue) ![Vite](https://img.shields.io/badge/Vite-Build%20Tool-green) ![Express](https://img.shields.io/badge/Express-Backend-orange) ![Supabase](https://img.shields.io/badge/Supabase-Database-darkgreen)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Project Overview

JLabs is a comprehensive IP geolocation tracking system that allows users to:

- **Authenticate** with email and password
- **Search** for any IP address's geolocation information
- **Visualize** IP locations on an interactive Leaflet map
- **Track** IP search history
- **Manage** IP records with bulk delete functionality
- **Monitor** detailed geolocation data (latitude, longitude, country, city, ISP, etc.)

The application consists of two main components:

1. **Frontend (Client)** - React + TypeScript + Vite
2. **Backend (Server)** - Node.js + Express + TypeScript

## ✨ Features

### Authentication
- ✅ Email/password login system
- ✅ Session-based authentication with JWT
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes (auto-redirect unauthenticated users)
- ✅ Logout functionality

### IP Geolocation
- ✅ Real-time IP lookup via IP-API
- ✅ Search any IP address or domain
- ✅ Display detailed geolocation data cards
- ✅ Interactive Leaflet map visualization
- ✅ Automatic map centering on IP location
- ✅ Markers with popup information

### IP History
- ✅ Automatic IP saving to user's history
- ✅ View all previously searched IPs
- ✅ Click IP to re-view its location
- ✅ Select/deselect multiple IPs
- ✅ Bulk delete with confirmation modal
- ✅ Search history persists across sessions

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme with gradient backgrounds
- ✅ Loading spinners during data fetching
- ✅ Error messages for invalid inputs
- ✅ Password visibility toggle
- ✅ Real-time form validation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe code
- **TanStack React Router** - Client-side routing
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Leaflet + React-Leaflet** - Interactive maps
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type-safe code
- **Supabase** - PostgreSQL database & auth backend
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Nodemon** - Development auto-reload
- **CORS** - Cross-origin request handling

### Database
- **Supabase (PostgreSQL)** - Managed database
- **Tables**: users, ip_data

### APIs
- **IP-API** (http://ip-api.com) - Free IP geolocation data

## 📁 Project Structure

```
JLabs/
├── client/                           # React frontend application
│   ├── src/
│   │   ├── main.tsx                 # App entry point
│   │   ├── index.css                # Global styles
│   │   ├── routes/
│   │   │   ├── __root.tsx           # Root layout
│   │   │   ├── index.tsx            # Login page (/)
│   │   │   └── geo.tsx              # Dashboard (/geo)
│   │   ├── components/
│   │   │   └── navbar.tsx           # Navigation bar
│   │   └── assets/                  # Static images
│   ├── public/                      # Public static files
│   ├── index.html                   # HTML template
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md                    # Client setup guide
│
├── server/                           # Express backend application
│   ├── src/
│   │   └── index.ts                 # Main server file
│   ├── controllers/
│   │   ├── user.controller.ts       # Auth logic
│   │   └── ip.controller.ts         # IP tracking logic
│   ├── routes/
│   │   ├── user.routes.ts           # Auth endpoints
│   │   └── ip.routes.ts             # IP endpoints
│   ├── middlewares/
│   │   └── auth.ts                  # Auth middleware
│   ├── lib/
│   │   └── supabase.ts              # Supabase client
│   ├── dummyData/
│   │   └── data.ts                  # Test data
│   ├── seedData.ts                  # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example                 # Environment template
│   └── README.md                    # Server setup guide
│
├── README.md                         # This file
└── .gitignore
```

## 📦 Prerequisites

Before setting up JLabs, ensure you have:

- **Node.js** v16.0.0+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Supabase Account** ([Create Free](https://supabase.com))
- **Git** (optional, for cloning)

### System Requirements
- RAM: 2GB minimum
- Disk Space: 500MB for dependencies
- Internet: Required for API calls and database

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd JLabs
```

### 2. Setup Backend (Server)
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=8000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
EOF

# Start development server
npm run dev
```

**Expected output:**
```
PORT is Listening on PORT 8000
```

### 3. Setup Frontend (Client)
```bash
cd ../client
npm install

# Start development server
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5173/
```

### 4. Access Application
Open your browser and navigate to:
```
http://localhost:5173
```

**Default Credentials** (if using seed data):
- Email: `test@example.com`
- Password: `password123`

## 🔧 Detailed Setup

### Backend Setup

#### Step 1: Install Dependencies
```bash
cd server
npm install
```

#### Step 2: Create Environment File
```bash
cp .env.example .env
# OR manually create .env with:
PORT=8000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

#### Step 3: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create or select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Key** → `SUPABASE_KEY`

#### Step 4: Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  userIP VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- IP data table
CREATE TABLE ip_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  ip VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ip_data_user_id ON ip_data(user_id);
CREATE INDEX idx_users_email ON users(email);
```

#### Step 5: Seed Database (Optional)
```bash
npm run seed
```

This populates the database with test data for development.

### Frontend Setup

#### Step 1: Install Dependencies
```bash
cd ../client
npm install
```

#### Step 2: Configuration
The frontend is pre-configured to connect to `http://localhost:8000`.

If your backend runs on a different port, update the API base URL in your code.

#### Step 3: Start Development Server
```bash
npm run dev
```

## ⚙️ Configuration

### Server Environment Variables
```env
# Server Configuration
PORT=8000                              # Server port
CLIENT_URL=http://localhost:5173       # Frontend URL (for CORS)

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### Client Configuration
Frontend connects to:
```
http://localhost:8000/api/*
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Both will start with hot-reload enabled.

### Production Build

**Build Backend:**
```bash
cd server
npm run build
npm start
```

**Build Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user_id": "uuid",
  "email": "user@example.com",
  "userIP": "123.45.67.89"
}
```

#### Get Current User
```http
GET /api/auth/me

Response: 200 OK
{
  "user_id": "uuid",
  "email": "user@example.com",
  "userIP": "123.45.67.89"
}
```

#### Logout
```http
POST /api/auth/logout

Response: 200 OK
```

### IP Endpoints

#### Save IP
```http
POST /api/ip/saveIP
Content-Type: application/json

{
  "ip": "8.8.8.8",
  "user_id": "uuid"
}

Response: 200 OK
```

#### Get IP History
```http
GET /api/ip/getIP?user_id=uuid

Response: 200 OK
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "ip": "8.8.8.8",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

#### Delete IPs
```http
DELETE /api/ip/deleteIP
Content-Type: application/json

{
  "ips": ["id1", "id2", "id3"]
}

Response: 200 OK
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

#### Blank Page on Frontend
- [ ] Verify backend is running on port 8000
- [ ] Check browser console (F12 → Console)
- [ ] Check network requests (F12 → Network)
- [ ] Clear cache: Ctrl+Shift+Delete

#### "Cannot GET /api..." Errors
- [ ] Backend server is not running
- [ ] Start server: `cd server && npm run dev`
- [ ] Verify port is 8000
- [ ] Check firewall settings

#### Supabase Connection Error
- [ ] Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- [ ] Check project is active in Supabase dashboard
- [ ] Ensure tables are created
- [ ] No extra spaces in .env file

#### Map Not Displaying
- [ ] Hard refresh browser: Ctrl+F5
- [ ] Clear cache
- [ ] Check browser console for Leaflet errors
- [ ] Verify coordinates are valid

#### Login Fails
- [ ] Check credentials in database
- [ ] Run seed script for test data: `npm run seed`
- [ ] Check browser Network tab for errors
- [ ] Verify CORS is enabled

### Debugging Tips

1. **Check Console Logs**
   - Frontend: Press F12 → Console tab
   - Backend: Check terminal output

2. **Network Inspection**
   - Press F12 → Network tab
   - Check request/response headers
   - Verify status codes (200, 400, 500, etc.)

3. **Database Inspection**
   - Open Supabase dashboard
   - Check table contents
   - Verify data types

4. **TypeScript Errors**
   ```bash
   cd server
   npx tsc --noEmit  # Check for errors
   ```

## 🔐 Security Notes

⚠️ **Development Only Setup**

This configuration is for local development. For production:

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use strong password requirements
- [ ] Implement rate limiting
- [ ] Add input validation/sanitization
- [ ] Enable SQL injection protection
- [ ] Use refresh tokens for auth
- [ ] Add CSRF protection
- [ ] Implement logging & monitoring

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TanStack Router](https://tanstack.com/router/)
- [Express.js](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Leaflet Maps](https://leafletjs.com)
- [Tailwind CSS](https://tailwindcss.com)

### API References
- [IP-API.com](http://ip-api.com)
- [OpenStreetMap](https://www.openstreetmap.org/)

## 🤝 Contributing

### Local Development
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and test locally
npm run dev

# Build to verify
npm run build
npm run lint

# Commit and push
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### Code Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Test changes locally before pushing
- Document significant changes

## 📋 Checklist for Local Setup

- [ ] Node.js v16+ installed
- [ ] Supabase account created
- [ ] Repository cloned
- [ ] Server .env file created with credentials
- [ ] Supabase tables created
- [ ] `npm install` run in both folders
- [ ] Backend starts: `npm run dev` in server
- [ ] Frontend starts: `npm run dev` in client
- [ ] Can access http://localhost:5173
- [ ] Can login with test credentials
- [ ] Can search for IP addresses
- [ ] Map displays correctly
- [ ] IP history saves/loads

## 📞 Support & Help

If you encounter issues:

1. **Check The README Files**
   - [Server README](./server/README.md)
   - [Client README](./client/README.md)

2. **Common Solutions**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Restart development servers
   - Clear browser cache
   - Check port availability

3. **Enable Debug Mode**
   ```bash
   # Backend
   DEBUG=* npm run dev
   
   # Frontend
   # Use browser DevTools (F12)
   ```

## 📄 License

ISC

## 👤 Author

Marc Miranda

---

## 🎉 Quick Links

- **Frontend:** http://localhost:5173 (after running `npm run dev`)
- **Backend API:** http://localhost:8000 (after running `npm run dev`)
- **IP-API Documentation:** http://ip-api.com/docs
- **Supabase Dashboard:** https://app.supabase.com

---

**Last Updated:** March 1, 2026

For detailed setup instructions, see:
- [Server README](./server/README.md) - Backend specific setup
- [Client README](./client/README.md) - Frontend specific setup
