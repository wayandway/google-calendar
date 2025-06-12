'use client';

import { Menu, Search, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-neutral-gray-200 flex items-center px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-neutral-gray-100 rounded-full"
          aria-label="메뉴 토글"
        >
          <Menu className="w-6 h-6 text-neutral-gray-500" />
        </button>
        <h1 className="text-2xl font-medium text-brand-primary">Calendar</h1>
      </div>

      <div className="flex-1 max-w-2xl mx-4" />
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 hover:bg-neutral-gray-100 rounded-full" aria-label="검색">
          <Search className="w-6 h-6 text-neutral-gray-500" />
        </button>
        <button className="p-2 hover:bg-neutral-gray-100 rounded-full" aria-label="도움말">
          <HelpCircle className="w-6 h-6 text-neutral-gray-500" />
        </button>
        <button className="p-2 hover:bg-neutral-gray-100 rounded-full" aria-label="설정">
          <Settings className="w-6 h-6 text-neutral-gray-500" />
        </button>
      </div>
    </header>
  );
}
