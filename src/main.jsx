import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./routes";
import axiosInit from "./initializers/axios";
import { Toaster } from "@/components/ui/toaster";

axiosInit();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);
