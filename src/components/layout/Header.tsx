'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-16 border-b bg-white">
      <div className="flex items-center h-full px-4">
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full" aria-label="메뉴">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center ml-4 space-x-4">
          <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600">
            Google Calendar
          </Link>
          <nav className="flex space-x-1">
            <Link
              href="/month"
              className={`px-3 py-2 text-sm rounded ${
                pathname === '/month' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              월
            </Link>
            <Link
              href="/week"
              className={`px-3 py-2 text-sm rounded ${
                pathname === '/week' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              주
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
