'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { LoginModal } from './login-modal';

interface AuthContextValue {
  user: ReturnType<typeof useAuth>['user'];
  isLoading: boolean;
  isAuthenticated: boolean;
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | undefined>();

  const openLoginModal = (message?: string) => {
    setLoginMessage(message);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginMessage(undefined);
  };

  const handleGoogleLogin = async () => {
    try {
      await auth.loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await auth.loginWithTwitter();
    } catch (error) {
      console.error('Twitter login failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        openLoginModal,
        closeLoginModal,
        logout: auth.logout,
      }}
    >
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onGoogleLogin={handleGoogleLogin}
        onTwitterLogin={handleTwitterLogin}
        message={loginMessage}
      />
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
