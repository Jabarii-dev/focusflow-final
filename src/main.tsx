import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { ConvexReactClient, useConvexAuth } from "convex/react"
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ErrorBoundary } from '@/components/error/boundary';
import { RouteErrorBoundary } from '@/components/error/route-error-boundary';
import { AuthForm } from '@/components/auth/auth-form';
import HomePage from '@/pages/home'
import CalendarPage from '@/pages/calendar'
import ProcrastinationAnalyzerPage from '@/pages/procrastination-analyzer'
import TaskDecomposerPage from '@/pages/task-decomposer'
import NotificationsPage from '@/pages/notifications'
import SettingsPage from '@/pages/settings'
import AnalyticsPage from '@/pages/analytics'
import DistractionCostPage from '@/pages/distraction-cost'
import '@/index.css'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from '@/components/theme-provider'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

// Handle module load failures (e.g., after deployment with stale chunks)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/procrastination",
    element: <ProcrastinationAnalyzerPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/task-decomposer",
    element: <TaskDecomposerPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/distraction-cost",
    element: <DistractionCostPage />,
    errorElement: <RouteErrorBoundary />,
  }
]);

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
    </ConvexAuthProvider>
  </StrictMode>,
)
