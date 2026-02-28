import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "doctor" | "patient";

interface User {
  email: string;
  name: string;
  role: UserRole;
  patientId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user mapping
const MOCK_USERS: Record<string, User> = {
  "dr.martin@clerk.fr": { email: "dr.martin@clerk.fr", name: "Dr. Laurent Martin", role: "doctor" },
  "marie.dupont@email.com": { email: "marie.dupont@email.com", name: "Marie Dupont", role: "patient", patientId: "1" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    const found = MOCK_USERS[email.toLowerCase()];
    if (found) {
      setUser(found);
      return true;
    }
    // Default to doctor for unknown emails (backward compat)
    setUser({ email, name: "Dr. Laurent Martin", role: "doctor" });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
