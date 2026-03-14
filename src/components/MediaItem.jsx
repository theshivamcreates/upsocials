import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaItem({ item, onLoaded }) {
  const isVideo = item.type === "video";
  const isGDrive = item.type === "gdrive";
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGridBuffering, setIsGridBuffering] = useState(true);
  const [isLightboxBuffering, setIsLightboxBuffering] = useState(true);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div className="relative break-inside-avoid mb-4 overflow-hidden rounded group bg-gray-50">
        
        {/* Expand Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (isVideo && isPlaying && videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
            setIsExpanded(true); 
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur hover:bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          title="Expand"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>

        {isVideo ? (
          <div className="relative w-full cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={item.url}
              loop
              playsInline
              onLoadStart={() => setIsGridBuffering(true)}
              onLoadedData={() => {
                setIsGridBuffering(false);
                if (onLoaded) onLoaded();
              }}
              onCanPlay={() => setIsGridBuffering(false)}
              onPlaying={() => setIsGridBuffering(false)}
              onWaiting={() => setIsGridBuffering(true)}
              onError={() => {
                setIsGridBuffering(false);
                if (onLoaded) onLoaded(); // treat error as "done" so spinner doesn't hang
              }}
              className="w-full h-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
              onEnded={() => setIsPlaying(false)}
            />
            {isGridBuffering && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg className="animate-spin text-white w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 bg-black/10'}`}>
              <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 pointer-events-auto cursor-pointer">
                {isPlaying ? (
                  <span className="text-black text-xs font-bold tracking-widest pl-1">||</span>
                ) : (
                  <span className="text-black text-xs font-bold tracking-widest pl-1">&#9654;</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <img
            src={item.url}
            alt={`Media ${item.tag}`}
            className="w-full h-auto object-contain transition-opacity duration-300 hover:opacity-90 cursor-pointer"
            onClick={() => setIsExpanded(true)}
            onLoad={() => {
              if (onLoaded) onLoaded();
            }}
            onError={() => {
              if (onLoaded) onLoaded(); // treat error as "done" so spinner doesn't hang
            }}
          />
        )}
      </div>

      {/* Lightbox Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12 cursor-pointer"
              onClick={() => setIsExpanded(false)}
            >
              {/* Close Button */}
              <button 
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative max-w-full max-h-full cursor-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {isVideo ? (
                  <div className="relative flex items-center justify-center max-w-full max-h-[85vh]">
                    {isLightboxBuffering && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20 rounded-lg">
                        <svg className="animate-spin text-white w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    <video
                      src={item.url}
                      controls
                      controlsList="nodownload"
                      autoPlay
                      onLoadStart={() => setIsLightboxBuffering(true)}
                      onLoadedData={() => setIsLightboxBuffering(false)}
                      onCanPlay={() => setIsLightboxBuffering(false)}
                      onPlaying={() => setIsLightboxBuffering(false)}
                      onWaiting={() => setIsLightboxBuffering(true)}
                      className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${isLightboxBuffering ? 'opacity-0' : 'opacity-100'}`}
                    />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Media expanded`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}