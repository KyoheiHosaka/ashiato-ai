'use client';

import { Header } from './header';
import { useAuthContext } from '@/components/auth';

export function HeaderWrapper() {
  const { user, openLoginModal, logout } = useAuthContext();

  return (
    <Header
      user={user}
      onLoginClick={() => openLoginModal()}
      onLogoutClick={logout}
    />
  );
}
