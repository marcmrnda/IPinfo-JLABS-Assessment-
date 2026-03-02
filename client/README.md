# JLabs Client

A modern React + TypeScript web application for IP geolocation tracking and monitoring. Features real-time map visualization, user authentication, and IP history management.

## Project Overview

JLabs is a full-stack geolocation application that allows users to:
- Login with email and password authentication
- Search for IP address geolocation data
- View IP locations on an interactive map
- Track and manage IP history
- Monitor latitude, longitude, country, city, and ISP information

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JLabs/client
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React & React Router
- TanStack React Router (routing)
- TypeScript (type safety)
- Vite (build tool)
- Tailwind CSS (styling)
- Leaflet & React-Leaflet (maps)
- Axios (HTTP client)
- React Icons (icons)

## Configuration

### Server URL Setup

The client is configured to connect to the backend server at `http://localhost:8000`.

If your server runs on a different port, you need to update the API base URL in your code.

**Default Backend:** `http://localhost:8000`

## Running the Application

### Development Mode (with Hot Reload)

```bash
npm run dev
```

The app will start on `http://localhost:5173` and automatically reload when you make changes.

**Output:**
```
➜  Local:   http://localhost:5173/
```

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Check code quality with ESLint

## Project Structure

```
client/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   ├── routeTree.gen.ts            # Auto-generated router config
│   ├── routes/
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Login page
│   │   └── geo.tsx                 # Geolocation tracking page
│   ├── components/
│   │   └── navbar.tsx              # Navigation bar
│   └── assets/                     # Static assets
├── public/                         # Public static files
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
├── tailwind.config.js              # Tailwind CSS config
├── eslint.config.js                # ESLint rules
└── package.json                    # Dependencies
```

## Key Features

### 1. Authentication (`/`)
- Email and password login
- Session-based authentication with cookies
- Password visibility toggle
- Error message display
- Protected routes (redirects to login if not authenticated)

### 2. Geolocation Dashboard (`/geo`)
- **Search Functionality** - Look up any IP address
- **Interactive Map** - View IP locations on Leaflet map
- **IP Information Cards** - Display:
  - IP Address
  - Latitude & Longitude
  - Country & City
  - Zip Code
  - ISP & Organization
- **IP History** - View and manage previously searched IPs
- **Bulk Delete** - Select and delete multiple IP records

### 3. UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Gradient background theme
- Loading spinners during data fetching
- Error handling and validation
- Eye icon for password visibility toggle

## API Integration

The client communicates with the backend server via Axios:

### Authentication Endpoints
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/me` - Get current user

### IP Endpoints
- **POST** `/api/ip/saveIP` - Save IP to history
- **GET** `/api/ip/getIP` - Retrieve IP history
- **DELETE** `/api/ip/deleteIP` - Delete IP records

## Technologies Used

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack React Router** - Client-side routing

### Build & Development
- **Vite** - Fast development build tool
- **ESLint** - Code quality
- **Tailwind CSS** - Utility-first CSS framework

### UI & Visualization
- **Leaflet** - Interactive maps
- **React-Leaflet** - React wrapper for Leaflet
- **React Icons** - Icon library
- **React Loader Spinner** - Loading indicators

### HTTP & Utilities
- **Axios** - HTTP client for API requests
- **Validator** - Input validation (IP address checking)

## Environment Setup

The client uses the following default settings:

```
API Base URL: http://localhost:8000
Client Port: 5173
Backend Port: 8000 (make sure server is running)
```

## Getting Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Backend Server
Make sure the server is running:
```bash
cd ../server
npm run dev
```

### Step 3: Start Frontend Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to `http://localhost:5173`

## Usage Guide

### Login
1. Open `http://localhost:5173`
2. Enter email and password
3. Click "Launch Console"

### Search for IP
1. Enter an IP address in the search field
2. Click "Search"
3. View results on the map and info cards

### View IP History
1. Scroll down to "IP History" section
2. Click on any IP to view its location
3. Select multiple IPs with checkboxes
4. Click "Delete Selected" to remove from history

### Reset Search
1. Click "Reset" button to clear current search results
2. Returns to your default IP location

## Troubleshooting

### Blank Page on Load
- Ensure the backend server is running on `http://localhost:8000`
- Check browser console (F12 → Console tab) for errors
- Verify network requests in Network tab

### "Cannot GET /api..." Errors
- Backend server is not running
- Start the server: `npm run dev` in the `server` directory
- Check that server is listening on port 8000

### Map Not Displaying
- Clear browser cache: Ctrl+Shift+Delete (Chrome)
- Hard refresh: Ctrl+F5
- Check browser console for Leaflet errors
- Verify geolocation coordinates are valid (lat/lon)

### Login Fails with Network Error
- Backend server must be running
- Check firewall settings
- Verify CORS is enabled on server
- Check browser Network tab for request details

### Slow Performance
- Clear browser cache and cookies
- Disable browser extensions
- Check network speed (Ctrl+Shift+I → Network → throttle)
- Rebuild: `npm run build` then `npm run preview`

## Development Tips

1. **Use Browser DevTools** - F12 for debugging
2. **Component Hot Reload** - Changes reflect immediately in dev mode
3. **TypeScript Checking** - Catch errors before runtime
4. **Network Tab** - Monitor API requests and responses
5. **Local Storage** - Session data persists across page reloads

## Building for Production

### Create Optimized Build
```bash
npm run build
```

### Output Location
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

### Deploy
1. Build: `npm run build`
2. Serve `dist/` folder with any HTTP server
3. Update backend server URL if needed
4. Deploy to hosting (Vercel, Netlify, GitHub Pages, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Styling

The application uses **Tailwind CSS** for styling. Key theme colors:

- **Primary:** Blue gradient (sky-200 → indigo-900)
- **Accent:** Amber/Gold
- **Cards:** Zinc backgrounds
- **Text:** Light amber on dark backgrounds

## Performance Optimizations

- **Code Splitting** - Routes load on demand
- **Asset Compression** - Built-in with Vite
- **Lazy Loading** - Components load when needed
- **Image Optimization** - Static assets in `public/`

## Contributing

For local development:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Build: `npm run build`
4. Lint: `npm run lint`
5. Submit pull request

## Troubleshooting Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend running on port 5173
- [ ] `.env` or config has correct backend URL
- [ ] No console errors (F12 → Console)
- [ ] Network requests successful (F12 → Network)
- [ ] Cookies/session data properly set
- [ ] IP address format is valid

## Support

For issues or questions:
- Check browser console for error messages
- Review network requests in DevTools
- Verify backend is running and responding
- Check GitHub issues (if applicable)
- Review Vite documentation: https://vitejs.dev
- Check React Router docs: https://tanstack.com/router/

## Next Steps

1. ✅ Install dependencies
2. ✅ Start the server
3. ✅ Run `npm run dev`
4. ✅ Test login and IP search
5. ✅ Explore IP history features
6. ✅ Build for production

---

**Author:** Marc Miranda  
**License:** ISC  
**Built with:** React, TypeScript, Vite, Tailwind CSS

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
