'use client';

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { LoginModal } from './login-modal';
import { ProfileSetupModal } from './profile-setup-modal';

interface AuthContextValue {
  user: ReturnType<typeof useAuth>['user'];
  isLoading: boolean;
  isAuthenticated: boolean;
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
  openProfileSetup: () => void;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | undefined>();
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.user);
  const hasCheckedNewUser = useRef(false);

  // Sync currentUser with auth.user
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(auth.user);
  }, [auth.user]);

  // Check if user is new (created within last 30 seconds)
  useEffect(() => {
    if (auth.user && !hasCheckedNewUser.current) {
      hasCheckedNewUser.current = true;
      const createdAt = new Date(auth.user.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;

      // Show profile setup if user was created within last 30 seconds
      if (diffSeconds < 30) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsProfileSetupOpen(true);
      }
    }
  }, [auth.user]);

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

  const handleProfileUpdate = (newName: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, display_name: newName });
    }
  };

  const refreshUser = () => {
    // Trigger a re-fetch by resetting the check flag
    hasCheckedNewUser.current = false;
  };

  const openProfileSetup = () => {
    setIsProfileSetupOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        openLoginModal,
        closeLoginModal,
        openProfileSetup,
        logout: auth.logout,
        refreshUser,
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
      {currentUser && (
        <ProfileSetupModal
          isOpen={isProfileSetupOpen}
          onClose={() => setIsProfileSetupOpen(false)}
          userId={currentUser.id}
          currentName={currentUser.display_name}
          onUpdate={handleProfileUpdate}
        />
      )}
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
