import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authStorage } from '../lib/auth-storage';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  clearToken: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const savedToken = authStorage.getToken();
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    const trimmed = newToken.trim();
    if (trimmed) {
      authStorage.setToken(trimmed);
      setToken(trimmed);
    } else {
      clearToken();
    }
  };

  const clearToken = () => {
    authStorage.clearToken();
    setToken(null);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        saveToken,
        clearToken,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
