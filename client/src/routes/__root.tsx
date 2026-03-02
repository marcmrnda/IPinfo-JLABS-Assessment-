// Root route configuration - defines the main app layout and context structure
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

// Interface for global application context passed to all routes
interface RouterContext {
  // User data from authentication context (null if not authenticated)
  user: any
  // Function to refetch user data from server
  refetchUser: () => Promise<void>
}

// Root route setup - provides context to all child routes
export const Route = createRootRouteWithContext<RouterContext>()({
  // Component renders child routes via Outlet
  component: () => 
  <>
  {/* Outlet renders the matched child route component */}
  <Outlet />
  
  </>
})