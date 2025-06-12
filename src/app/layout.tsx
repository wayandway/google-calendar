import React from 'react';

import type { Metadata } from 'next';

import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Google Calendar',
  description:
    'Google Calendar를 사용해 회의를 공유하고 약속 일정을 잡아보세요. 비즈니스와 개인 생활에서 중요한 일을 관리할 수 있습니다.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
