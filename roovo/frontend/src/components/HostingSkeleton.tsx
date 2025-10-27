"use client";

import MagicBento from './MagicBento';
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const HostingSkeleton = () => {
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
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[64rem] px-3 text-center">
            <div className="h-12 bg-gray-800 rounded-md w-1/2 mx-auto mt-12" />
          </div>
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={false}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </div>
      </div>
    </div>
  );
};

export default HostingSkeleton;
