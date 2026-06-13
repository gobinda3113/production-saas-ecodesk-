import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "@/store";
import { Toaster } from "@/components/Toaster";
import { mountApp } from "./shared";
import ResetPassword from "@/pages/ResetPassword";

mountApp(
  <HelmetProvider>
    <StoreProvider>
      <ResetPassword />
      <Toaster />
    </StoreProvider>
  </HelmetProvider>
);
