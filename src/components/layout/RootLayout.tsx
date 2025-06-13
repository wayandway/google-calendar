'use client';

import React from 'react';

import { Provider } from 'react-redux';

import Header from '@/components/layout/Header';
import { MiniCalendar } from '@/components/mini-calendar';
import { store } from '@/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 p-4 border-r bg-white">
            <MiniCalendar />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </Provider>
  );
}
