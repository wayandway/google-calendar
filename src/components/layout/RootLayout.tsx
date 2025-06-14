'use client';

import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { RootState } from '@/store';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isSidebarOpen } = useSelector((state: RootState) => state.layout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
