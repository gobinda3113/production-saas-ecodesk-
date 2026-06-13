import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "@/store";
import { Toaster } from "@/components/Toaster";
import { mountApp } from "./shared";
import ForgotPassword from "@/pages/ForgotPassword";

mountApp(
  <HelmetProvider>
    <StoreProvider>
      <ForgotPassword />
      <Toaster />
    </StoreProvider>
  </HelmetProvider>
);
