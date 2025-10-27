"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/hosting', label: 'Today' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/manage-listings', label: 'Listings' },
  { href: '/messages', label: 'Messages' },
];

const HostHeader = () => {
  const pathname = usePathname();

  return (
    <header className="relative z-50 bg-white text-black p-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className={`font-semibold ${
                pathname === item.href ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center gap-2 text-slate-700 font-medium p-2 rounded-full transition-colors whitespace-nowrap group cursor-pointer">
            <Image src="/buttons/travel_mode.png" alt="Switch to travelling" width={48} height={48} className=" transition-transform duration-300 group-hover:scale-110" />
            <span>Switch to travelling</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HostHeader;
