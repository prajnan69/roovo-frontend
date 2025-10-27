"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import supabase from '@/services/api';
import SwitchingToHostLoader from '@/components/SwitchingToHostLoader';
import RotatingText from '@/components/RotatingText';
import HostingSkeleton from '@/components/HostingSkeleton';
import MagicBento from '@/components/MagicBento';
import SplitText from '@/components/SplitText';
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const HostingPage = () => {
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const cameFromHosting = sessionStorage.getItem('fromHosting');
    if (cameFromHosting) {
      setLoading(false);
      sessionStorage.removeItem('fromHosting');
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: host } = await supabase
          .from('hosts')
          .select('id, name')
          .eq('user_id', session.user.id)
          .single();
        if (host) {
          setIsHost(true);
          setUserName(host.name || '');
        }
      }
      // setLoading will be handled by the loader's onAnimationComplete callback
      setCheckingStatus(false);
    };
    checkUser();
  }, []);

  if (checkingStatus) {
    return <HostingSkeleton />;
  }

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center"
        animate={{ backgroundColor: isTransitioning ? '#000' : '#fff' }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <SwitchingToHostLoader
          onAnimationComplete={() => setLoading(false)}
          onTransitionStart={() => setIsTransitioning(true)}
        />
        <motion.div
          className="mt-4 flex items-center justify-center text-2xl font-bold"
          animate={{ color: isTransitioning ? '#fff' : '#000' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <span>roovo&nbsp;</span>
          <RotatingText
            texts={['travelling', 'hosting']}
            rotationInterval={1800}
            loop={false}
            transition={{ duration: 1, ease: "easeInOut"}}
            staggerDuration={0}
            splitBy="words"
          />
        </motion.div>
      </motion.div>
    );
  }

  if (isHost) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar>
          <NavBody>
            <div className="flex items-center gap-x-8">
              <NavbarLogo />
              <NavItems
                items={[
                  { name: "Contact Support", link: "#" },
                  { name: "Manage Subscription", link: "#" },
                ]}
              />
            </div>
            <NavbarButton href="/">Switch to travelling</NavbarButton>
          </NavBody>
        </Navbar>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[64rem] px-3 text-center">
            <SplitText text={`Welcome, ${userName}👋`} tag="h1" className="text-4xl font-bold mt-12" />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Link href="/hosting/account-settings">
              <MagicBento
                textAutoHide={true}
              enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Join our hosting community</h1>
        <p className="text-slate-600 mb-12">Choose the path that's right for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/import-listing">
            <motion.div
              className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 h-64"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src="/icons/rehost.png" alt="Already hosted" width={96} height={96} className="mb-4" />
              <span className="text-xl font-semibold text-slate-800">Already hosted</span>
              <p className="text-slate-500 mt-2">Import your existing listing from another site.</p>
            </motion.div>
          </Link>
          <Link href="/become-a-host">
            <motion.div
              className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 h-64"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src="/icons/newhost.png" alt="New to hosting" width={96} height={96} className="mb-4" />
              <span className="text-xl font-semibold text-slate-800">New to hosting</span>
              <p className="text-slate-500 mt-2">Create a new listing from scratch.</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HostingPage;
