import React from 'react';

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import './globals.css';
import { Providers } from '@/components/providers/Providers';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'Google Calendar Clone',
  description: 'A Google Calendar clone built with Next.js and Redux Toolkit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
