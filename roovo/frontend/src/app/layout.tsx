"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ModernSearchBar, { transition } from "@/components/ModernSearchBar";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerMenu from "@/components/HamburgerMenu";
import { usePathname } from "next/navigation";
import Login from "@/components/Login";
import BecomeAHost from "@/components/BecomeAHost";
import Image from "next/image";

const inter = Inter({
variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState({ name: "Bengaluru", img: "/bengaluru.png" });
  const [dates, setDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({ checkIn: null, checkOut: null });
  const [adults, setAdults] = useState(0);
  const [childrenState, setChildrenState] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBecomeAHostOpen, setIsBecomeAHostOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to false to test the login flow
  const [loginMessage, setLoginMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/become-a-host' || pathname === '/import-listing';

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
          // Gently snap back to the top if not scrolled far enough
          if (scrollTop > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    setLoginMessage(null);
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-slate-50">
        <Login 
          isOpen={isLoginOpen} 
          onClose={closeLogin} 
          onLoginSuccess={handleLoginSuccess}
          title={loginMessage?.title} 
          subtitle={loginMessage?.subtitle} 
        />
        <BecomeAHost isOpen={isBecomeAHostOpen} onClose={() => setIsBecomeAHostOpen(false)} />
        {!isLoginPage && <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />}
        {!isLoginPage && (
        <header 
          ref={headerRef}
          className="bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="relative flex items-center justify-between h-20">
              <div className="flex-1 flex justify-start">
                <div className="text-2xl font-bold text-slate-900">Roovo</div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md">
                <AnimatePresence>
                  {isScrolled && (
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
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setIsBecomeAHostOpen(true)} className="flex items-center gap-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap group cursor-pointer">
                    <Image src="/icons/become_host.png" alt="Become a host" width={48} height={48} className="transition-transform duration-300 group-hover:scale-110" />
                    <span>Become a host</span>
                  </button>
                  {isLoggedIn ? (
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 cursor-pointer">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                  ) : (
                    <button onClick={() => setIsLoginOpen(true)} className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-300">Login</button>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {!isScrolled && (
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
          <motion.div
            className="h-px bg-slate-200 mx-auto"
            animate={{ width: isScrolled ? "28rem" : "100%" }}
            transition={transition}
          />
        </header>
        )}
        
        {children}
      </body>
    </html>
  );
}
