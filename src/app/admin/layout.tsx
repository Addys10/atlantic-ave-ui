'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, RefreshCw, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setChecking(false);
      }
    });
  }, [pathname, router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  const navItems = [
    { href: '/admin', label: 'Přehled', icon: <LayoutDashboard size={17} />, exact: true },
    { href: '/admin/products', label: 'Produkty', icon: <Package size={17} /> },
    { href: '/admin/orders', label: 'Objednávky', icon: <ShoppingBag size={17} /> },
    { href: '/admin/restock', label: 'Restock', icon: <RefreshCw size={17} /> },
    { href: '/admin/settings', label: 'Nastavení', icon: <Settings size={17} /> },
  ];

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="px-5 py-5 border-b border-gray-200">
        <span className="font-cloister text-lg text-gray-900 tracking-wider select-none">Atlantic Ave</span>
        <p className="text-xs text-gray-400 mt-0.5 tracking-widest uppercase">Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              (item.exact ? pathname === item.href : pathname.startsWith(item.href))
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className="pt-2">
          <Link
            href="/admin/orders/new"
            onClick={onNavClick}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors border ${
              pathname === '/admin/orders/new'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-700 border-gray-200 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            <span className="text-base leading-none">+</span>
            Nová objednávka
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={async () => { await supabase.auth.signOut(); router.replace('/admin/login'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut size={17} />
          Odhlásit se
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-5 h-14">
        <span className="font-cloister text-lg text-gray-900 tracking-wider select-none">Atlantic Ave</span>
        <button onClick={() => setMobileOpen(true)} className="text-gray-500 hover:text-gray-900 transition-colors">
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 md:hidden bg-white border-r border-gray-200 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-gray-200">
                <span className="font-cloister text-lg text-gray-900 tracking-wider select-none">Atlantic Ave</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col flex-1 overflow-auto">
                <SidebarContent onNavClick={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
