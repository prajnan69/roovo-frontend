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
  const [userName, setUserName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isSwitching = sessionStorage.getItem('isSwitchingToHost');
    if (isSwitching) {
      setShowLoader(true);
      sessionStorage.removeItem('isSwitchingToHost');
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
    };
    checkUser();
  }, []);

  if (showLoader) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center"
        animate={{ backgroundColor: isTransitioning ? '#000' : '#fff' }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <SwitchingToHostLoader
          onAnimationComplete={() => setShowLoader(false)}
          onTransitionStart={() => setIsTransitioning(true)}
        />
        <motion.div
          className="mt-4 flex items-center justify-center text-2xl font-bold"
          animate={{ color: isTransitioning ? '#fff' : '#000' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Image src="/logo.png" alt="Roovo" width={100} height={40} />
          <div className="w-4" />
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
        url: '/hosting/reservations',
        onClick: () => router.push('/hosting/reservations')
      },
      {
        color: '#060010',
        title: 'Calendar',
        description: 'Manage your availability',
        label: 'Planning',
        url: '/hosting/calendar',
        onClick: () => router.push('/hosting/calendar')
      },
      {
        color: '#060010',
        title: 'Listings',
        description: 'Manage your properties',
        label: 'Properties',
        url: '/hosting/manage-listings',
        onClick: () => router.push('/hosting/manage-listings')
      },
      {
        color: '#060010',
        title: 'Messages',
        description: 'Communicate with your guests',
        label: 'Communication',
        url: '/hosting/messages',
        onClick: () => router.push('/hosting/messages')
      },
      {
        color: '#060010',
        title: 'Account Settings',
        description: 'Manage your account details',
        label: 'Settings',
        url: '/hosting/account-settings',
        onClick: () => router.push('/hosting/account-settings')
      },
      {
        color: '#060010',
        title: 'Create New Listing',
        description: 'Add a new property to your portfolio',
        label: 'New',
        url: '/hosting/new-listing',
        onClick: () => router.push('/hosting/new-listing')
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
            <SplitText text={`Welcome to hosting dasboard, ${userName}👋`} tag="h1" className="text-4xl font-bold mt-12" />
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Spinner size={24} />
    </div>
  );
};

export default HostingPage;
