// Main entry point for the React application - Sets up routing and authentication
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import axios from 'axios'
import { DNA } from 'react-loader-spinner'

import { routeTree } from './routeTree.gen'

// Interface defining the router context available to all routes
interface RouterContext {
  // Current authenticated user data
  user: any
  // Function to refetch user data from server
  refetchUser: () => Promise<void>
}

// Initialize router with route tree and default context
const router = createRouter({
  routeTree,
  context: { user: null, refetchUser: async () => {} } as RouterContext,
})

// Register router type for type-safe router usage throughout the app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Main App component - handles authentication and user data fetching
function App() {
  // State for storing authenticated user data
  const [user, setUser] = useState<any>(null)
  // Loading state for initial user fetch
  const [loading, setLoading] = useState(true)

  // Fetches current user data from server - defined outside useEffect to allow context passing
  const fetchUser = async () => {
    try {
      // Request authenticated user data from server
      const res = await axios.get("/api/auth/me", {
        withCredentials: true
      })
      setUser(res.data)
    } catch (error) {
      // Set user to null if request fails (user not authenticated)
      setUser(null)
    } finally {
      // Mark loading as complete after fetch attempt
      setLoading(false)
    }
  }

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser()
  }, [])

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <DNA
        visible={true}
        height="500"
        width="500"
        ariaLabel="dna-loading"
        wrapperStyle={{
          margin: "auto",
          marginTop: 120
        }}
        wrapperClass="dna-wrapper"
      />
    )
  }

  // Provide user data and refetch function to all routes via context
  return <RouterProvider router={router} context={{ user, refetchUser: fetchUser }} />
}

// Render React app to DOM root element
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)