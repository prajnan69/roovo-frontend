"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: 'H' },
  { href: '/search', label: 'Search', icon: 'S' },
  { href: '/messages', label: 'Messages', icon: 'M' },
  { href: '/profile', label: 'Profile', icon: 'P' },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black border-t border-gray-800">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a className={`inline-flex flex-col items-center justify-center px-5 h-full ${
              pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}>
              <div className="w-8 h-8 mb-1 border border-gray-600 flex items-center justify-center bg-gray-900">
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default BottomNavBar;
