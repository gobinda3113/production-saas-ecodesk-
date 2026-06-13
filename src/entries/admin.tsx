import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider, useStore } from "@/store";
import { Toaster } from "@/components/Toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { mountApp } from "./shared";

const AdminOverview = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.AdminOverview })));
const AdminClients = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.AdminClients })));
const AdminPayments = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.AdminPayments })));
const AdminWebhooks = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.AdminWebhooks })));
const AdminSystem = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.AdminSystem })));

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
  if (!role) {
    window.location.href = "/admin/login";
    return <PageLoader />;
  }
  if (role !== "admin") {
    window.location.href = "/dashboard";
    return <PageLoader />;
  }
  return <>{children}</>;
}

function AdminRouting() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin" element={<Protected><AdminOverview /></Protected>} />
        <Route path="/admin/clients" element={<Protected><AdminClients /></Protected>} />
        <Route path="/admin/payments" element={<Protected><AdminPayments /></Protected>} />
        <Route path="/admin/webhooks" element={<Protected><AdminWebhooks /></Protected>} />
        <Route path="/admin/system" element={<Protected><AdminSystem /></Protected>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
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
            <AdminRouting />
            <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
