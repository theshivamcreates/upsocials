import { useRef, useEffect } from "react";

const DRIVE_LINK = "https://drive.google.com/file/d/17ScYqBFhEIpyZQRfKEzOTMUYYxR5XmX-/view?usp=sharing";

const Check = ({ color }) => (
  <svg style={{ color }} className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const Cross = () => (
  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MOST_POPULAR_INDEX = 2; // Brand Growth

const plans = [
  {
    name: "Basic Presence",
    tag: null,
    price: "₹9,999",
    for: "Local businesses, shops, clinics & early-stage brands.",
    whatsapp: "https://wa.me/917880533628?text=Hi!%20I'm%20interested%20in%20the%20Basic%20Presence%20PLAN.",
    accent: "#6b7280",
    accentBg: "#f9fafb",
    border: "#e5e7eb",
    features: [
      { label: "5 Static Social Media Posts", badge: null },
      { label: "8 Reels", badge: "BASIC EDITING" },
      { label: "Instagram & Facebook Management", badge: null },
      { label: "Monthly Content Calendar", badge: null },
      { label: "Caption Writing + Hashtags", badge: null },
      { label: "Paid Ad Campaigns", off: true },
      { label: "LinkedIn Management", off: true },
      { label: "Performance Analytics", off: true },
      { label: "Strategy Call", off: true },
    ],
  },
  {
    name: "Presence Plus",
    tag: null,
    price: "₹14,999",
    for: "Businesses building consistent presence across platforms.",
    whatsapp: "https://wa.me/917880533628?text=Hi!%20I'm%20interested%20in%20the%20Presence%20Plus%20PLAN.",
    accent: "#1B2A59",
    accentBg: "#edf0f8",
    border: "#c7d0ea",
    features: [
      { label: "10 Static Social Media Posts", badge: null },
      { label: "12 Reels", badge: "STANDARD EDITING" },
      { label: "Instagram & Facebook Management", badge: null },
      { label: "Content Calendar + Strategy", badge: null },
      { label: "Captions + Hashtags + SEO", badge: null },
      { label: "Paid Ad Campaigns", off: true },
      { label: "Performance Analytics", off: true },
      { label: "Strategy Call", off: true },
      { label: "Dedicated Account Manager", off: true },
    ],
  },
  {
    name: "Brand Growth",
    tag: "MOST POPULAR",
    price: "₹19,999",
    for: "Growing brands & founders ready to scale their audience.",
    whatsapp: "https://wa.me/917880533628?text=Hi!%20I'm%20interested%20in%20the%20Brand%20Growth%20PLAN.",
    accent: "#3BADB8",
    accentBg: "#e6f6f8",
    border: "#3BADB8",
    features: [
      { label: "15 Static Social Media Posts", badge: null },
      { label: "15 Reels", badge: "ADVANCED EDITING" },
      { label: "Instagram & Facebook Management", badge: null },
      { label: "Full Content Calendar + Strategy", badge: null },
      { label: "Captions + Hashtags + SEO", badge: null },
      { label: "2 Paid Ad Campaigns", badge: "INCLUDED" },
      { label: "Monthly Analytics Report", badge: null },
      { label: "Strategy Call", off: true },
      { label: "Dedicated Account Manager", off: true },
    ],
  },
  {
    name: "Full Scale",
    tag: "BEST VALUE",
    price: "₹24,999",
    for: "Established brands & creators going all-in on growth.",
    whatsapp: "https://wa.me/917880533628?text=Hi!%20I'm%20interested%20in%20the%20Full%20Scale%20PLAN.",
    accent: "#1B2A59",
    accentBg: "#edf0f8",
    border: "#1B2A59",
    features: [
      { label: "25 Static Posts", badge: null },
      { label: "20 Reels", badge: "CINEMATIC EDITING" },
      { label: "Instagram & Facebook Management", badge: null },
      { label: "Full Content Calendar + Strategy", badge: null },
      { label: "Captions + Hashtags + SEO", badge: null },
      { label: "3 Paid Ad Campaigns", badge: "INCLUDED" },
      { label: "Weekly Analytics Report", badge: null },
      { label: "Monthly Strategy Call", badge: "INCLUDED" },
      { label: "Dedicated Account Manager", badge: "INCLUDED" },
    ],
  },
];

/** Reusable card body — used in both desktop grid and mobile carousel */
function PlanCard({ plan }) {
  return (
    <>
      {/* Tag banner */}
      {plan.tag ? (
        <div
          className="text-center py-2 text-[10px] font-bold tracking-widest"
          style={{ backgroundColor: plan.accent, color: "#fff" }}
        >
          + {plan.tag}
        </div>
      ) : (
        <div className="py-2" style={{ backgroundColor: "#f9fafb" }} />
      )}

      {/* Header */}
      <div className="p-5 pb-4" style={{ backgroundColor: plan.accentBg }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: plan.accent }}>
          {plan.name}
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-xs text-gray-400 mb-0.5">/ month</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-snug">{plan.for}</p>
      </div>

      {/* CTA */}
      <div className="px-5 pt-4 pb-2">
        <a
          href={plan.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="block text-center py-2.5 rounded-lg text-xs font-bold tracking-wide transition-opacity hover:opacity-85"
          style={{ backgroundColor: plan.accent, color: "#fff" }}
        >
          Get Started
        </a>
      </div>

      {/* Divider + section label */}
      <div className="mx-5 my-3 h-px bg-gray-100" />
      <p className="px-5 mb-2 text-[10px] font-bold text-gray-400 tracking-widest uppercase">What's included</p>

      {/* Feature list */}
      <ul className="px-5 pb-6 flex flex-col gap-2.5 flex-1">
        {plan.features.map((f, j) => (
          <li key={j} className="flex items-start gap-2">
            {f.off ? <Cross /> : <Check color={plan.accent} />}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[11px] leading-snug ${f.off ? "text-gray-300 line-through" : "text-gray-700"}`}>
                {f.label}
              </span>
              {f.badge && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: plan.accent, color: "#fff" }}
                >
                  {f.badge}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Pricing() {
  const carouselRef = useRef(null);

  // On mobile, auto-scroll to the Most Popular card instantly on mount
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || window.innerWidth >= 768) return;

    // Wait one frame so layout is painted before scrolling
    requestAnimationFrame(() => {
      const cards = el.querySelectorAll("[data-card]");
      if (cards[MOST_POPULAR_INDEX]) {
        const cardLeft = cards[MOST_POPULAR_INDEX].offsetLeft;
        const containerPad = 24; // px-6 = 1.5rem = 24px
        el.scrollLeft = cardLeft - containerPad;
      }
    });
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Transparent & simple</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pricing Plans</h1>
        <p className="hidden md:block text-sm text-gray-500 max-w-lg leading-relaxed">
          No hidden fees. No surprise invoices. Pick the plan that fits where you are today — and scale when you're ready.
        </p>
        <div className="mt-4 h-px w-10 bg-gray-900" />
      </div>

      {/* ── Desktop grid (md+) ── */}
      <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="relative flex flex-col rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-xl"
            style={{ border: `2px solid ${plan.border}` }}
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* ── Mobile snap-scroll carousel ── */}
      <div
        ref={carouselRef}
        className="md:hidden flex gap-3 overflow-x-auto -mx-6 px-6 mb-4"
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
          .pricing-carousel::-webkit-scrollbar { display: none; }
        `}</style>

        {plans.map((plan, i) => (
          <div
            data-card
            key={i}
            className="pricing-carousel relative flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              border: `2px solid ${plan.border}`,
              width: "78vw",
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
            }}
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* Dot indicators (mobile only) */}
      <div className="md:hidden flex justify-center gap-2 mb-8">
        {plans.map((p, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === MOST_POPULAR_INDEX ? "20px" : "6px",
              height: "6px",
              backgroundColor: i === MOST_POPULAR_INDEX ? plans[MOST_POPULAR_INDEX].accent : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* Download row */}
      <div className="rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-bold text-gray-900 mb-0.5">Want the full breakdown?</p>
          <p className="text-[11px] text-gray-400">Download our catalog for detailed deliverables, add-ons & enterprise pricing.</p>
        </div>
        <a
          href={DRIVE_LINK}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Download Catalog ↓
        </a>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        All plans billed monthly. Custom & project-based quotes available.{" "}
        <a href="/contact" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          Talk to us →
        </a>
      </p>

    </div>
  );
}
