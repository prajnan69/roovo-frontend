"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { fetchListingById } from "@/services/api"; // Import the API function
import { Spinner } from "@/components/ui/shadcn-io/spinner"; // Import the Spinner component
import ListingDetails from "./ListingDetails"; // Import the new component
interface Card {
  id: string;
  description: string | React.ReactNode;
  title: string;
  src: string;
  ctaText: string;
  ctaLink?: string;
  onClick?: () => void;
  onEdit?: (data: any) => void; // Add onEdit prop
  content: React.ReactNode | (() => React.ReactNode);
}

// Helper function to format the description string
const formatDescription = (description: string | React.ReactNode) => {
  if (typeof description !== "string") {
    return description;
  }
  return description
    .replace("$", "₹")
    .replace("Rating:", "★")
    .replaceAll(" - ", " · ");
};


export default function ExpandableCardDemo({ cards }: { cards: Card[] }) {
  const [active, setActive] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const id = useId();

  return (
    <div className="flex h-screen">
      <div className={`transition-all duration-500 ${active ? 'w-1/3' : 'w-full'}`}>
        <ul className="max-w-4xl mx-auto w-full gap-4 h-full overflow-y-auto p-4">
          {cards.map((card) => (
            <motion.div
              layoutId={`card-${card.id}-${id}`}
              key={`card-${card.id}-${id}`}
            onClick={async () => {
              setLoading(true);
              try {
                const data = await fetchListingById(card.id);
                console.log("Listing data:", data);
                setActive({
                  ...card,
                  content: () => <ListingDetails data={data} />,
                });
              } catch (error) {
                console.error("Failed to fetch listing details:", error);
              } finally {
                setLoading(false);
              }
            }}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.id}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.id}-${id}`}
                  className="font-medium text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.id}-${id}`}
                  className="text-neutral-400 text-center md:text-left"
                >
                  {formatDescription(card.description)}
                </motion.p>
              </div>
            </div>
            {loading && <Spinner />}
          </motion.div>
        ))}
        </ul>
      </div>
      <div className={`transition-all duration-500 ${active ? 'w-2/3 p-4' : 'w-0'}`}>
        {active && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto no-scrollbar"
          >
            {typeof active.content === "function"
              ? (active.content as Function)()
              : active.content}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
