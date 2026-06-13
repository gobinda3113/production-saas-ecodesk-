import { HelmetProvider } from "react-helmet-async";
import { mountApp } from "./shared";
import Terms from "@/pages/Terms";

mountApp(
  <HelmetProvider>
    <Terms />
  </HelmetProvider>
);
