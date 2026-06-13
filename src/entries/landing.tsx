import { HelmetProvider } from "react-helmet-async";
import { mountApp } from "./shared";
import Landing from "@/pages/Landing";

mountApp(
  <HelmetProvider>
    <Landing />
  </HelmetProvider>
);
