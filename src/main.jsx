import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.jsx";
import { MotionPreferences } from "./components/MotionPreferences.jsx";
import "./styles/global.css";

if (import.meta.env.PROD) inject();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionPreferences><App /></MotionPreferences>
  </React.StrictMode>
);
