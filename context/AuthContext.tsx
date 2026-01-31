import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Lắng nghe trạng thái đăng nhập từ Firebase
  useEffect(() => {
      // Firebase Auth is disabled/removed, just finish loading
      setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    // Always use Mock Login since auth is null
    console.warn("Using Mock Login (Firebase Auth disabled)");
    const mockUser = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[1];
    setUser(mockUser);
  };

  const register = async (email: string, password: string, name: string) => {
      // Mock Registration
      console.warn("Using Mock Registration");
      const mockId = Date.now();
      const newUser: any = {
          id: mockId,
          name: name,
          email: email,
          role: UserRole.USER, // Mặc định là User
          avatar: `https://i.pravatar.cc/150?u=${mockId}`
      };
      
      // Try to save to firestore if db is available
      if (db) {
        try {
            await setDoc(doc(db, "users", mockId.toString()), newUser);
        } catch (e) {
            console.error("Error saving mock user to firestore:", e);
        }
      }
      
      setUser(newUser);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};