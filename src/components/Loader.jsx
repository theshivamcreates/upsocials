import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "../hooks/useStore";

export default function Loader({ onComplete }) {
  const { data } = useStore();
  const [phase, setPhase] = useState("text"); // 'text' -> 'images' -> 'outro'

  // Extract a few images from the global store for the burst animation
  // fallback to generic placeholders if the user hasn't uploaded enough images yet.
  const images = data?.media?.filter((m) => m.type === "image").slice(0, 4) || [];
  
  const placeholders = [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
  ];

  const burstImages = images.length >= 4 ? images.map(i => i.url) : placeholders;

  useEffect(() => {
    // Orchestrate the phases
    const timer1 = setTimeout(() => setPhase("images"), 1800); // 1.8s for text to finish typing
    const timer2 = setTimeout(() => setPhase("outro"), 4000); // Images stay on screen for a bit
    const timer3 = setTimeout(() => onComplete(), 5200); // Wait for background to slide up before unmounting

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Framer Motion Variants
  const containerVars = {
    hidden: { opacity: 1 },
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const letterVars = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  const imageVars = {
    hidden: { opacity: 0, scale: 0, rotate: -20 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      rotate: [-15, 10, -5, 5, 0][i % 5] || i * 5, // Spread them out randomly
      transition: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.15 }
    }),
    exit: { opacity: 0, scale: 1.5, transition: { duration: 0.5 } }
  };

  const text = "upsocials".split("");

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#111] flex items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      animate={phase === "outro" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} // smooth, sharp ease-in-out
    >
      
      {/* 1. TEXT TYPING PHASE */}
      <AnimatePresence>
        {phase === "text" && (
          <motion.div
            className="flex items-center justify-center space-x-1"
            variants={containerVars}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.4 } }}
          >
            {text.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVars}
                className="text-white text-6xl md:text-8xl font-bold tracking-tighter"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. IMAGE BURST PHASE */}
      <AnimatePresence>
        {phase === "images" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {burstImages.map((src, i) => (
              <motion.img
                key={i}
                src={src}
                custom={i}
                variants={imageVars}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute w-64 h-80 object-cover rounded shadow-2xl"
                style={{ zIndex: i }}
              />
            ))}
            
            {/* Keeping the logo floating small on top during images */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ delay: 0.6 }}
              className="absolute z-10 text-white text-5xl font-bold mix-blend-difference"
            >
              upsocials
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
