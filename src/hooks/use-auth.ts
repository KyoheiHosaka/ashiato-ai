'use client';

import { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    supabaseUser: null,
    session: null,
    isLoading: true,
  });

  const supabase = createBrowserClient();

  // Fetch user profile from users table, upsert if missing
  const fetchUserProfile = useCallback(
    async (supabaseUser: import('@supabase/supabase-js').User): Promise<User | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!error && data) return data;

      // プロフィールが存在しない場合はトリガーの代わりに作成
      const displayName =
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split('@')[0] ||
        'ユーザー';
      const { data: created } = await supabase
        .from('users')
        .upsert({
          id: supabaseUser.id,
          display_name: displayName,
          avatar_url: supabaseUser.user_metadata?.avatar_url ?? null,
          provider: supabaseUser.app_metadata?.provider ?? 'google',
        })
        .select('*')
        .single();

      return created ?? null;
    },
    [supabase]
  );

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setState({ user: userProfile, supabaseUser: session.user, session, isLoading: false });
        } else {
          setState({ user: null, supabaseUser: null, session: null, isLoading: false });
        }
      } catch {
        setState({ user: null, supabaseUser: null, session: null, isLoading: false });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setState({
          user: userProfile,
          supabaseUser: session.user,
          session,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          supabaseUser: null,
          session: null,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }, [supabase]);

  // Login with Twitter/X
  const loginWithTwitter = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Twitter login error:', error);
      throw error;
    }
  }, [supabase]);

  // Logout
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [supabase]);

  return {
    ...state,
    loginWithGoogle,
    loginWithTwitter,
    logout,
    isAuthenticated: !!state.session,
  };
}
