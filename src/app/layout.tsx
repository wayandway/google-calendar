import React from 'react';

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

import RootLayout from '@/components/layout/RootLayout';
import ReduxProvider from '@/components/providers/ReduxProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
      <body className={roboto.className}>
        <ReduxProvider>
          <RootLayout>{children}</RootLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
