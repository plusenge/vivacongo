import { createContext, useState, useEffect, useRef } from "react";
import { FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loading from "../components/Loading";
import useAuth from "../context/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
