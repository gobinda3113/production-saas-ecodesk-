import { HelmetProvider } from "react-helmet-async";
import { mountApp } from "./shared";
import NotFound from "@/pages/NotFound";

mountApp(
  <HelmetProvider>
    <NotFound />
  </HelmetProvider>
);
