import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider, useStore } from "@/store";
import { Toaster } from "@/components/Toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { mountApp } from "./shared";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Keywords = lazy(() => import("@/pages/Keywords"));
const Connections = lazy(() => import("@/pages/Connections"));
const Billing = lazy(() => import("@/pages/Billing"));
const Settings = lazy(() => import("@/pages/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { role } = useStore();
  const location = useLocation();
  if (!role) {
    window.location.href = "/login";
    return <PageLoader />;
  }
  if (role !== "client") {
    window.location.href = "/admin";
    return <PageLoader />;
  }
  return <>{children}</>;
}

function DashboardRouting() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/keywords" element={<Protected><Keywords /></Protected>} />
        <Route path="/connections" element={<Protected><Connections /></Protected>} />
        <Route path="/billing" element={<Protected><Billing /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

mountApp(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <DashboardRouting />
            <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
