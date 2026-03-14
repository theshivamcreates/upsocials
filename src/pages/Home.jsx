import { useState, useEffect } from "react";
import MediaRow from "../components/MediaRow";
import { useStore } from "../hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Home() {
  const { data } = useStore();
  const [nicheSets, setNicheSets] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const shuffleNiches = () => {
      const sets = (data.niches || []).map(niche => {
        const nicheMedia = data.media.filter(m => m.niche === niche.tag);
        // Shuffle array
        const shuffled = [...nicheMedia].sort(() => 0.5 - Math.random());
        // Limit to 4 for the horizontal row
        return { niche, items: shuffled.slice(0, 4) };
      }).filter(s => s.items.length > 0);
      
      setNicheSets(sets);
      setLoadedCount(0); // reset load whenever reshuffled
    };

    shuffleNiches();

    // Re-shuffle every 30 minutes (1800000 ms)
    const interval = setInterval(shuffleNiches, 1800000);
    return () => clearInterval(interval);
  }, [data]);

  // Only count the first item of each niche (index 0 = always visible on all screen sizes).
  // Hidden items (index 1-3) may never fire onLoadedData on smaller screens,
  // which would cause the spinner to get permanently stuck.
  const totalMedia = nicheSets.length; // one per niche (the always-visible item)
  const allLoaded = totalMedia > 0 ? loadedCount >= totalMedia : true;

  const handleItemLoaded = () => {
    setLoadedCount(prev => prev + 1);
  };

  if (!nicheSets || nicheSets.length === 0) return <div className="text-gray-400 p-8">No content mapped to niches yet.</div>;

  return (
    <div className="w-full relative pt-4 min-h-[50vh] max-w-[1600px] mx-auto">
      {/* Unified Section Loader via Portal */}
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

      <div className={`transition-opacity duration-700 ease-in-out ${allLoaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {nicheSets.map(set => (
          <MediaRow key={set.niche.id} niche={set.niche} items={set.items} onLoaded={handleItemLoaded} />
        ))}
      </div>
    </div>
  )
}
