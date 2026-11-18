import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyMode } from "./engine/mode.js";
import App from "./App.jsx";

// Choose the sideways or downwards layout before the first paint.
applyMode();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
