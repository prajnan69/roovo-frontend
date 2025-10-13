"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const hostNavItems = [
  { href: '/manage-listings', label: 'Listings' },
  { href: '/manage-bookings', label: 'Bookings' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/payouts', label: 'Payouts' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/superhost', label: 'Superhost' },
];

const TopNavBar = () => {
  const pathname = usePathname();

  // Only show the top nav on host-related pages
  if (!hostNavItems.some(item => pathname.startsWith(item.href))) {
    return null;
  }

  return (
    <header className="bg-black text-white p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Host Dashboard</h1>
        <nav className="flex space-x-6">
          {hostNavItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className={`font-semibold ${
                pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopNavBar;
