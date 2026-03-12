'use client';

import { Header } from './header';
import { useAuthContext } from '@/components/auth';

export function HeaderWrapper() {
  const { user, supabaseUser, openLoginModal, openProfileSetup, logout } = useAuthContext();
  const isAdmin = supabaseUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <Header
      user={user}
      isAdmin={isAdmin}
      onLoginClick={() => openLoginModal()}
      onLogoutClick={logout}
      onEditProfileClick={openProfileSetup}
    />
  );
}
