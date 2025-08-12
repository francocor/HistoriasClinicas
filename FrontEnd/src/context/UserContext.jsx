import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false); // ✅ importante

  // Al montar, cargamos desde sessionStorage si la sesión es válida
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");
    const expiry = parseInt(sessionStorage.getItem("sessionExpiry") || "0", 10);

    const now = Date.now();
    const isValid = now < expiry;

    console.log("🌐 savedUser:", savedUser);
    console.log("🕐 sessionExpiry:", expiry, "| now:", now, "| valid:", isValid);

    if (savedUser && savedToken && isValid) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("sessionExpiry");
    }

    setIsReady(true); // ✅ indica que ya cargó
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, isReady }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);