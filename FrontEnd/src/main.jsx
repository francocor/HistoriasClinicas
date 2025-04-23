import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext"; // 👈 Importamos el provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider> {/* Envolvemos la app */}
      <App />
    </UserProvider>
  </React.StrictMode>
);