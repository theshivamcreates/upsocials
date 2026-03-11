import { useState, useRef, useEffect } from "react";
import { useStore } from "../hooks/useStore";

// Default placeholder image if no photo is provided
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Team+Member&background=random";

/** Reusable card body for team member */
function MemberCard({ member }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Photo header */}
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src={member.photo || DEFAULT_AVATAR}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name row with badge pinned to the right */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{member.name}</h3>
          {member.badge && (
            <span
              className="shrink-0 text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border border-gray-900 text-gray-900 whitespace-nowrap"
            >
              {member.badge}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4">{member.work}</p>
        
        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 mb-4" />
        
        <p className="text-sm text-gray-600 leading-relaxed flex-grow">
          {member.experience}
        </p>
      </div>
    </div>
  );
}

export default function Team() {
  const { data } = useStore();
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Guard against undefined team array
  const team = data.team || [];

  // Track active slide in the mobile carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPosition = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.8; // 80vw approximation
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < team.length) {
        setActiveIndex(newIndex);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeIndex, team.length]);

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">The People</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Team</h1>
        <p className="max-w-xl text-sm md:text-base text-gray-500 leading-relaxed mb-6">
          Meet the creative minds behind the work. We're a tight-knit crew of designers, 
          editors, and strategists obsessed with making things look good and perform better.
        </p>
        <div className="h-px w-10 bg-gray-900" />
      </div>

      {team.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-500">No team members added yet.</p>
          <p className="text-xs text-gray-400 mt-2">Head to the Admin panel to add your crew.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop grid (md+) ── */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {team.map((member, i) => (
              <div
                key={member.id || i}
                className="relative flex flex-col rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-gray-100"
              >
                <MemberCard member={member} />
              </div>
            ))}
          </div>

          {/* ── Mobile snap-scroll carousel ── */}
          <div
            ref={carouselRef}
            className="md:hidden flex gap-4 overflow-x-auto -mx-6 px-6 pb-6"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingRight: "1.5rem",
            }}
          >
            {/* Hide native scrollbar on webkit */}
            <style>{`
              .team-carousel::-webkit-scrollbar { display: none; }
            `}</style>

            {team.map((member, i) => (
              <div
                data-card
                key={member.id || i}
                className="team-carousel relative flex flex-col rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100"
                style={{
                  width: "80vw",
                  scrollSnapAlign: "center",
                  scrollSnapStop: "always",
                }}
              >
                <MemberCard member={member} />
              </div>
            ))}
          </div>

          {/* Dot indicators (mobile only) */}
          <div className="md:hidden flex justify-center gap-2 mb-8">
            {team.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: i === activeIndex ? "#111827" : "#d1d5db", // gray-900 for active, gray-300 for inactive
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
