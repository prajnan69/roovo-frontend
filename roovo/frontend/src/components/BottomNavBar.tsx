"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { AiFillHome, AiOutlineHome, AiFillMessage, AiOutlineMessage } from 'react-icons/ai';
import { IoSearch, IoSearchOutline } from 'react-icons/io5';
import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa';

const navItems: {
  href: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
}[] = [
  { href: '/', label: 'Home', icon: AiOutlineHome, activeIcon: AiFillHome },
  { href: '/search', label: 'Search', icon: IoSearchOutline, activeIcon: IoSearch },
  { href: '/messages', label: 'Messages', icon: AiOutlineMessage, activeIcon: AiFillMessage },
  { href: '/profile', label: 'Profile', icon: FaRegUserCircle, activeIcon: FaUserCircle },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black border-t border-gray-800 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className={`inline-flex flex-col items-center justify-center px-5 h-full text-gray-400 transition-all duration-300 ease-in-out
                ${isActive ? 'text-white' : 'hover:text-white hover:scale-110'}
              `}>
                <Icon  />
                <span className="text-xs">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNavBar;
