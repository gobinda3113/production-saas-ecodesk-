import { HelmetProvider } from "react-helmet-async";
import { mountApp } from "./shared";
import Privacy from "@/pages/Privacy";

mountApp(
  <HelmetProvider>
    <Privacy />
  </HelmetProvider>
);
