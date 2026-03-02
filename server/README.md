# JLabs Server

A Node.js/Express backend server for the JLabs application - an IP geolocation tracking and monitoring dashboard.

## Project Overview

This server handles:
- User authentication (login/logout)
- IP address geolocation tracking
- User session management
- IP history storage and retrieval
- Integration with Supabase database

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase Account** - [Create Free Account](https://supabase.com)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JLabs/server
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (web framework)
- TypeScript (for type safety)
- Supabase (database)
- bcrypt (password hashing)
- JWT (authentication)
- Nodemon (development server)

## Environment Setup

### 1. Create .env File

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=8000
CLIENT_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select or create a new project
3. Navigate to **Settings** > **API**
4. Copy your:
   - Project URL → `SUPABASE_URL`
   - Anon Key → `SUPABASE_KEY`

### 3. Database Setup

Make sure your Supabase project has the following tables:

#### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  userIP VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### IP History Table
```sql
CREATE TABLE ip_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  ip VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Running the Server

### Development Mode (with Auto-Reload)

```bash
npm run dev
```

This uses **Nodemon** to automatically restart the server when files change.

**Output:**
```
PORT is Listening on PORT 8000
```

### Production Mode

First, build the TypeScript code:

```bash
npm run build
```

Then run the compiled JavaScript:

```bash
npm start
```

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run start`** - Start production server
- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm run seed`** - Populate database with dummy data (development only)

## Seed Data (Optional)

To populate the database with dummy data for testing:

```bash
npm run seed
```

This runs `seedData.ts` which inserts test users and IP data into your Supabase database.

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: User data on success

- **POST** `/api/auth/logout` - Logout user
  - Clears session and cookies

- **GET** `/api/auth/me` - Get current authenticated user
  - Returns: Current user data or error if not authenticated

### IP Routes (`/api/ip`)

- **POST** `/api/ip/saveIP` - Save IP to user's history
  - Body: `{ ip, user_id }`
  - Returns: Saved IP record

- **GET** `/api/ip/getIP` - Retrieve user's IP history
  - Query: `user_id`
  - Returns: Array of IP records

- **DELETE** `/api/ip/deleteIP` - Delete selected IPs from history
  - Body: `{ ips: [array of ip ids] }`
  - Returns: Success message

## Connecting the Client

The client (React app) runs on `http://localhost:5173` by default.

Make sure the server is configured to accept requests from the client:

```env
CLIENT_URL=http://localhost:5173
```

The server enables CORS and cookies for cross-origin requests.

## Troubleshooting

### Port Already in Use

If port 8000 is already in use:

```bash
# Set a different port
PORT=3001 npm run dev
```

Or kill the process using port 8000:

**Windows:**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :8000
kill -9 <PID>
```

### Supabase Connection Error

- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check that your Supabase project is active
- Ensure your .env file has no extra spaces

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Errors

```bash
# Rebuild TypeScript
npm run build
```

## Project Structure

```
server/
├── src/
│   └── index.ts              # Main server file
├── controllers/
│   ├── user.controller.ts    # User auth logic
│   └── ip.controller.ts      # IP tracking logic
├── routes/
│   ├── user.routes.ts        # User API routes
│   └── ip.routes.ts          # IP API routes
├── middlewares/
│   └── auth.ts               # Authentication middleware
├── lib/
│   └── supabase.ts           # Supabase client setup
├── dummyData/
│   └── data.ts               # Test data
├── seedData.ts               # Database seeding script
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## Development Tips

1. **Enable TypeScript Strict Mode** - Catch errors early
2. **Use Nodemon** - Auto-restart on file changes with `npm run dev`
3. **Check Logs** - Monitor console output for errors
4. **Test Endpoints** - Use Postman or VSCode REST Client
5. **Keep .env Secure** - Never commit .env to git

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up .env file
3. ✅ Create Supabase tables
4. ✅ Run `npm run dev`
5. ✅ Test API endpoints
6. ✅ Start the client app

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation: https://supabase.com/docs
- Check Express documentation: https://expressjs.com

---

**Author:** Marc Miranda  
**License:** ISC
