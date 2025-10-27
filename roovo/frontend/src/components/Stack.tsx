import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
import Image from 'next/image';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  cardsData?: { id: number; img: string }[];
  animationConfig?: { stiffness: number; damping: number };
  onImageLoad: () => void;
  isHovered?: boolean;
}

export default function Stack({
  randomRotation = true,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  onImageLoad,
  isHovered
}: StackProps) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
          {
            id: 1,
            img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format'
          },
          {
            id: 2,
            img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format'
          },
          {
            id: 3,
            img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format'
          },
          {
            id: 4,
            img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format'
          }
        ]
  );

  const sendToBack = (id: number) => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  const sendToFront = (id: number) => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.push(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600
      }}
    >
      {cards.map((card, index) => {
        const isTopCard = index === cards.length - 1;
        const randomRotate = !isTopCard && randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
            <motion.div
              className="rounded-2xl overflow-hidden border-4 border-white"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: isTopCard ? 0 : (cards.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height
              }}
            >
              <Image src={card.img} alt={`card-${card.id}`} width={cardDimensions.width} height={cardDimensions.height} className="w-full h-full object-cover pointer-events-none" onLoad={onImageLoad} />
            </motion.div>
          </CardRotate>
        );
      })}
      {isHovered && (
        <div className="absolute bottom-2 right-2 z-20 flex space-x-2 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sendToFront(cards[0].id);
            }}
            className="p-1 rounded-full bg-white/50 backdrop-blur-sm text-gray-800 font-semibold shadow-md hover:bg-white/75 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sendToBack(cards[cards.length - 1].id);
            }}
            className="p-1 rounded-full bg-white/50 backdrop-blur-sm text-gray-800 font-semibold shadow-md hover:bg-white/75 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
          