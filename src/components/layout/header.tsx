'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Menu, X, PenSquare, User, Settings, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG } from '@/constants';

interface HeaderProps {
  user?: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onEditProfileClick?: () => void;
}

export function Header({ user, onLoginClick, onLogoutClick, onEditProfileClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              事例を探す
            </Link>
            <Link
              href="/post/new"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <PenSquare className="h-4 w-4" />
              足跡を残す
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.display_name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-600">
                      {user.display_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.display_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      マイページ
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onEditProfileClick?.();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      表示名を変更
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogoutClick?.();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" />
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={onLoginClick}>
                ログイン
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                事例を探す
              </Link>
              <Link
                href="/post/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PenSquare className="h-4 w-4" />
                足跡を残す
              </Link>
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 pb-2">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.display_name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-600">
                          {user.display_name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {user.display_name}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      マイページ
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onEditProfileClick?.();
                      }}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Settings className="h-4 w-4" />
                      表示名を変更
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogoutClick?.();
                      }}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      ログアウト
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onLoginClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    ログイン
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
