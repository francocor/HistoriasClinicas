import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false); // ✅ importante

  // Al montar, cargamos desde localStorage si la sesión es válida
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const expiry = parseInt(localStorage.getItem("sessionExpiry") || "0", 10);

    const now = Date.now();
    const isValid = now < expiry;

    console.log("🌐 savedUser:", savedUser);
    console.log("🕐 sessionExpiry:", expiry, "| now:", now, "| valid:", isValid);

    if (savedUser && savedToken && isValid) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionExpiry");
    }

    setIsReady(true); // ✅ indica que ya cargó
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, isReady }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);