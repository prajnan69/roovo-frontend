"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import supabase from '@/services/api';
import SwitchingToHostLoader from '@/components/SwitchingToHostLoader';
import RotatingText from '@/components/RotatingText';
import MagicBento from '@/components/MagicBento';
import SplitText from '@/components/SplitText';
import NewListingModal from '@/components/NewListingModal';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Spinner } from '@/components/ui/shadcn-io/spinner';

const HostingPage = () => {
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const router = useRouter();

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
    };
    checkUser();
  }, []);

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
    const cardData = [
      {
        color: '#060010',
        title: 'Today',
        description: 'View your reservations for today',
        label: 'Reservations',
        onClick: () => console.log('Reservations clicked') // Placeholder
      },
      {
        color: '#060010',
        title: 'Calendar',
        description: 'Manage your availability',
        label: 'Planning',
        onClick: () => console.log('Calendar clicked') // Placeholder
      },
      {
        color: '#060010',
        title: 'Listings',
        description: 'Manage your properties',
        label: 'Properties',
        onClick: () => console.log('Listings clicked') // Placeholder
      },
      {
        color: '#060010',
        title: 'Messages',
        description: 'Communicate with your guests',
        label: 'Communication',
        onClick: () => console.log('Messages clicked') // Placeholder
      },
      {
        color: '#060010',
        title: 'Account Settings',
        description: 'Manage your account details',
        label: 'Settings',
        onClick: () => router.push('/hosting/account-settings')
      },
      {
        color: '#060010',
        title: 'Create New Listing',
        description: 'Add a new property to your portfolio',
        label: 'New',
        onClick: () => setIsNewListingModalOpen(true)
      }
    ];

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
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
            <NavbarButton
              onClick={() => {
                setIsSwitching(true);
                router.push('/');
              }}
              loading={isSwitching}
            >
              Switch to travelling
            </NavbarButton>
          </NavBody>
        </Navbar>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full px-3 text-center">
            <SplitText text={`Welcome, ${userName}👋`} tag="h1" className="text-4xl font-bold mt-12" />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
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
              cardData={cardData}
            />
          </motion.div>
        </div>
        <NewListingModal isOpen={isNewListingModalOpen} onClose={() => setIsNewListingModalOpen(false)} loading={isModalLoading} />
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
          <Link href="/import-listing" onClick={() => setIsNavigating(true)}>
            <motion.div
              className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 h-64"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isNavigating ? (
                <Spinner size={48} />
              ) : (
                <>
                  <Image src="/icons/rehost.png" alt="Already hosted" width={96} height={96} className="mb-4" />
                  <span className="text-xl font-semibold text-slate-800">Already hosted</span>
                  <p className="text-slate-500 mt-2">Import your existing listing from another site.</p>
                </>
              )}
            </motion.div>
          </Link>
          <Link href="/become-a-host" onClick={() => setIsNavigating(true)}>
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
