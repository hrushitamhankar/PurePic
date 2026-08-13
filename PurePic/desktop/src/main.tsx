import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { TooltipProvider } from "./components/ui/tooltip";

import "./styles/globals.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider delay={600}>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);