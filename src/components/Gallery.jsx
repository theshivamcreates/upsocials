import MediaItem from "./MediaItem"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Gallery({ media }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const totalMedia = media?.length || 0;
  const allLoaded = totalMedia > 0 ? loadedCount >= totalMedia : true;

  useEffect(() => {
    // Reset load count when media array changes
    setLoadedCount(0);
  }, [media]);

  if (!media || media.length === 0) return <div className="text-gray-400 p-8">No media found.</div>;

  const handleItemLoaded = () => {
    setLoadedCount(prev => prev + 1);
  };

  return (
    <div className="relative min-h-[50vh] w-full max-w-[1600px] mx-auto">
      {/* Unified Section Loader via Portal to break out of layout transforms */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {!allLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-[60] flex flex-col items-center justify-center bg-white"
            >
              <svg className="animate-spin text-black w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Loading Portfolio...</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Masonry Grid */}
      <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 transition-opacity duration-700 ease-in-out ${allLoaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {media.map((item, index) => (
          <MediaItem key={item.id || index} item={item} onLoaded={handleItemLoaded} />
        ))}
      </div>
    </div>
  )
}