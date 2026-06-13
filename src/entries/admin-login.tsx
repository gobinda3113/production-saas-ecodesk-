import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "@/store";
import { Toaster } from "@/components/Toaster";
import { mountApp } from "./shared";
import Login from "@/pages/Login";

mountApp(
  <HelmetProvider>
    <StoreProvider>
      <Login admin />
      <Toaster />
    </StoreProvider>
  </HelmetProvider>
);
