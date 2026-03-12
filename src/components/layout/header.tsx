'use client';

import Link from 'next/link';
import { User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  user?: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  isAdmin?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onEditProfileClick?: () => void;
}

export function Header({ user, isAdmin, onLoginClick, onLogoutClick, onEditProfileClick }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-end justify-between">

        {/* Logotype */}
        <Link href="/" className="group flex flex-col gap-0.5">
          <span className="text-2xl leading-none tracking-tight">
            <span className="font-extralight text-gray-400">my</span>
            <span className="font-bold text-emerald-500">AI</span>
            <span className="font-extralight text-gray-400">logs</span>
          </span>
          <span className="text-[9px] tracking-[0.3em] text-gray-300 transition-colors group-hover:text-gray-400">
            みんなの AI あしあと記録
          </span>
        </Link>

        {/* Auth */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="h-7 w-7 rounded-full"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-medium text-emerald-600">
                  {user.display_name.charAt(0)}
                </div>
              )}
              <span className="hidden text-xs text-gray-500 sm:block">{user.display_name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-black/5">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-3.5 w-3.5" />
                  マイページ
                </Link>
                <button
                  onClick={() => { setIsUserMenuOpen(false); onEditProfileClick?.(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  表示名を変更
                </button>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    管理ページ
                  </Link>
                )}
                <div className="border-t border-gray-50" />
                <button
                  onClick={() => { setIsUserMenuOpen(false); onLogoutClick?.(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-500 hover:bg-gray-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="text-xs text-gray-400 transition-colors hover:text-gray-900"
          >
            ログイン
          </button>
        )}

      </div>
    </header>
  );
}
