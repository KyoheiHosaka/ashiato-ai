'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Menu, X, PenSquare } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG } from '@/constants';

interface HeaderProps {
  user?: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export function Header({ user, onLoginClick, onLogoutClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
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
                </Link>
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
                    <Link
                      href="/profile"
                      className="flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                    </Link>
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
