import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/common/Toast';
import { PageLoader } from './components/common/Spinner';
import { ROUTES } from './config/constants';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const WorkspaceList = lazy(() => import('./pages/WorkspaceList'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SourcesPage = lazy(() => import('./pages/SourcesPage'));
const EntitiesPage = lazy(() => import('./pages/EntitiesPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth guard component
function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

// Public route guard (redirect to workspaces if already logged in)
function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.WORKSPACES} replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.WORKSPACES} element={<WorkspaceList />} />

            {/* Workspace routes with layout */}
            <Route
              path="/workspaces/:workspaceId"
              element={
                <WorkspaceProvider>
                  <AppLayout />
                </WorkspaceProvider>
              }
            >
              <Route index element={<Navigate to="chat" replace />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:conversationId" element={<ChatPage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="entities" element={<EntitiesPage />} />
              <Route path="glossary" element={<GlossaryPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="graph" element={<KnowledgeGraphPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
