"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ModernSearchBar, { transition } from "@/components/ModernSearchBar";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "@/components/HamburgerMenu";
import { usePathname } from "next/navigation";
import BottomNavBar from "@/components/BottomNavBar";
import Login from "@/components/Login";
import BecomeAHost from "@/components/BecomeAHost";
import Image from "next/image";
import Link from "next/link";
import supabase from '@/services/api';
import WordRotate from "@/components/ui/word-rotate";
import Notifications from "@/components/Notifications";

const inter = Inter({
variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(pathname.startsWith('/listing/'));
  const [selectedCity, setSelectedCity] = useState({ name: "Bengaluru", img: "/bengaluru.png" });
  const [dates, setDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({ checkIn: null, checkOut: null });
  const [adults, setAdults] = useState(0);
  const [childrenState, setChildrenState] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBecomeAHostOpen, setIsBecomeAHostOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevPathname = useRef(pathname);
  const isLoginPage = pathname === '/login' || pathname === '/become-a-host' || pathname === '/import-listing' || pathname.startsWith('/hosting');
  const [isMobile, setIsMobile] = useState(false);

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
      const { data: host } = await supabase
        .from('hosts')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      if (host) {
        setIsHost(true);
      }
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // Close the login modal on any route change
      if (isLoginOpen) {
        closeLogin();
      }

      // Collapse the search bar only when navigating to a listing page
      if (pathname.startsWith('/listing/')) {
        setIsScrolled(true);
      } else if (pathname === '/') {
        // Ensure the search bar is expanded when returning to the home page
        setIsScrolled(false);
      }
    }
    prevPathname.current = pathname;
  }, [pathname, isLoginOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrollTop = window.scrollY;
        const snapThreshold = 40; // A small, fixed threshold

        if (scrollTop > snapThreshold) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }, 150); // Debounce time
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleExpand = () => {
    // On listing pages, expand by setting state. On homepage, scroll to top.
    if (pathname.startsWith('/listing/')) {
      setIsScrolled(false);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsHost(false);
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    checkUser();
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    setLoginMessage(null);
    setRedirectPath(undefined);
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preload" href="/icons/man_t.png" as="image" />
        <link rel="preload" href="/icons/man_h.png" as="image" />
        <link rel="preload" href="/icons/globe_t.png" as="image" />
      </head>
      <body className="antialiased bg-slate-50">
        <Login 
          isOpen={isLoginOpen} 
          onClose={closeLogin} 
          onLoginSuccess={handleLoginSuccess}
          title={loginMessage?.title} 
          subtitle={loginMessage?.subtitle}
          redirectPath={redirectPath}
        />
        <BecomeAHost 
          isOpen={isBecomeAHostOpen} 
          onClose={() => setIsBecomeAHostOpen(false)} 
          isLoggedIn={isLoggedIn}
          openLogin={(path) => {
            setIsBecomeAHostOpen(false);
            setIsLoginOpen(true);
            setLoginMessage({ 
              title: "Log in to start hosting", 
              subtitle: "Create an account or log in to manage your listings." 
            });
            setRedirectPath(path);
          }}
        />
        {!isLoginPage && <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />}
        {!isLoginPage && !isMobile && (
        <header 
          ref={headerRef}
          className="sticky top-0 z-50 bg-white"
        >
          <div className="mx-auto">
            <div className="relative flex items-center justify-between h-20 px-6">
              <div className="flex-1 flex justify-start">
                <Link href="/" className="flex items-center text-2xl font-bold text-slate-900">
                  <Image src="/logo.png" alt="Roovo" width={100} height={40} />
                  {(pathname === '/messages' || pathname === '/bookings') && (
                    <WordRotate
                      words={[`.${pathname.split('/')[1]}`]}
                      className="text-2xl font-bold text-slate-900"
                    />
                  )}
                </Link>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md">
                <AnimatePresence>
                  {isScrolled && pathname !== '/messages' && pathname !== '/bookings' && !pathname.startsWith('/listing/') && (
                    <ModernSearchBar
                      showSlidingText={!pathname.startsWith('/listing/')}
                      isCollapsed={isScrolled}
                      onExpand={handleExpand}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    dates={dates}
                    setDates={setDates}
                    adults={adults}
                    setAdults={setAdults}
                    childrenState={childrenState}
                    setChildrenState={setChildrenState}
                    infants={infants}
                    setInfants={setInfants}
                      pets={pets}
                      setPets={setPets}
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center space-x-2">
                  {isLoggedIn && isHost ? (
                    <>
                      <Link 
                        href="/hosting" 
                        className="hover:text-indigo-500 flex items-center gap-2 text-slate-700 font-medium p-2 rounded-full transition-colors whitespace-nowrap group cursor-pointer"
                        onClick={() => sessionStorage.setItem('isSwitchingToHost', 'true')}
                      >
                        <Image src="/buttons/host_mode.png" alt="Switch to hosting" width={32} height={32} className="transition-transform duration-300 group-hover:scale-110" />
                        <span>Switch to hosting</span>
                      </Link>
                      <Notifications />
                    </>
                  ) : (
                    <button onClick={() => setIsBecomeAHostOpen(true)} className="flex items-center gap-2 text-slate-700 font-medium hover:text-indigo-500 p-2 rounded-full transition-colors whitespace-nowrap group cursor-pointer">
                      <Image src="/icons/become_host.png" alt="Become a host" width={56} height={56} className="transition-transform duration-300 group-hover:scale-110" />
                      <span>Become a host</span>
                    </button>
                  )}
                  {isLoggedIn ? (
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 cursor-pointer">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                  ) : (
                    <button onClick={() => setIsLoginOpen(true)} className="cursor-pointer rounded-4xl border-2 bg-none text-black font-semibold py-2 px-4  hover:bg-indigo-200 transition-colors duration-300">Login</button>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {!isScrolled && pathname !== '/messages' && pathname !== '/bookings' && !pathname.startsWith('/listing/') && (
                <motion.div
                  className=""
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
                >
                  <div className="pb-4">
                    <ModernSearchBar
                      isCollapsed={isScrolled}
                      onExpand={handleExpand}
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                      dates={dates}
                      setDates={setDates}
                      adults={adults}
                      setAdults={setAdults}
                      childrenState={childrenState}
                      setChildrenState={setChildrenState}
                      infants={infants}
                      setInfants={setInfants}
                      pets={pets}
                      setPets={setPets}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        )}
        
        <main >
          {children}
        </main>
        {!isLoginPage && isMobile && !pathname.startsWith('/listing/') && <BottomNavBar />}
      </body>
    </html>
  );
}
