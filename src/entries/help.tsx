import { HelmetProvider } from "react-helmet-async";
import { mountApp } from "./shared";
import HelpCenter from "@/pages/HelpCenter";

mountApp(
  <HelmetProvider>
    <HelpCenter />
  </HelmetProvider>
);
