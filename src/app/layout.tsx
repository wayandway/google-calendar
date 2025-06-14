import React from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import RootLayout from '@/components/layout/RootLayout';
import ReduxProvider from '@/components/providers/ReduxProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Google Calendar',
  description: 'Google Calendar를 사용해 회의를 공유하고 약속 일정을 잡아보세요.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReduxProvider>
          <RootLayout>{children}</RootLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
