import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext"; // 👈 Importalo también

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <NotificationProvider> {/* Envolvé la App */}
        <App />
      </NotificationProvider>
    </UserProvider>
  </React.StrictMode>
);