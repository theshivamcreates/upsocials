import { Link } from "react-router-dom";
import MediaItem from "./MediaItem";
import { motion } from "framer-motion";

export default function MediaRow({ niche, items, onLoaded }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-black">
          {niche.name}
        </h2>
        <Link 
          to={`/niche/${niche.tag}`} 
          className="text-xs font-bold tracking-widest text-gray-500 hover:text-black transition-colors uppercase flex items-center gap-1"
        >
          See All <span className="text-lg leading-none">&rsaquo;</span>
        </Link>
      </div>
      
      {/* 
        Responsive Row Layout:
        Mobile: Shows only the 1st item.
        Tablet (sm): Shows 2 items.
        Desktop (lg): Shows 3 items.
        Wide (xl): Shows 4 items.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => {
          // Determine visibility based on index to enforce "single row" responsive limits
          let displayClass = "block";
          if (index === 1) displayClass = "hidden sm:block";
          if (index === 2) displayClass = "hidden lg:block";
          if (index === 3) displayClass = "hidden xl:block";

          return (
            <motion.div 
              key={`${item.id}-${index}`} 
              className={displayClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MediaItem item={item} onLoaded={onLoaded} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
