const DRIVE_LINK = "https://drive.google.com/file/d/17ScYqBFhEIpyZQRfKEzOTMUYYxR5XmX-/view?usp=sharing";
export default function Pricing() {
  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
        Transparent & simple
      </p>
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Pricing</h1>
      <div className="h-px w-10 bg-gray-900 mb-6" />

      {/* Intro text */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        At Upsocials, we believe great content shouldn't come with hidden surprises.
        Our packages are designed to be flexible — whether you're a founder building
        your personal brand from scratch, or an established business ready to scale
        your content operations.
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        We offer tailored plans across <span className="text-gray-900 font-semibold">social media management</span>,{" "}
        <span className="text-gray-900 font-semibold">cinematic video production</span>,{" "}
        <span className="text-gray-900 font-semibold">performance marketing</span>, and{" "}
        <span className="text-gray-900 font-semibold">full-service brand storytelling</span>.
        Every plan is customisable — we'll scope the right package for your goals on a discovery call.
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-10">
        For a complete breakdown of our packages, deliverables, and pricing tiers,
        download our pricing guide below.
      </p>

      {/* Download card */}
      <div className="border border-gray-200 p-6 flex items-center justify-between gap-6 group hover:border-gray-900 transition-colors duration-200">
        <div>
          <p className="text-xs font-bold text-gray-900 mb-1">Upsocials Pricing Guide</p>
          <p className="text-[11px] text-gray-400">PDF · Updated March 2025</p>
        </div>
        <a
          href={DRIVE_LINK}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 hover:bg-gray-700 transition-colors"
        >
          Download PDF
          <span className="text-gray-400 group-hover:translate-y-0.5 transition-transform">↓</span>
        </a>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        Prefer to talk it through first?{" "}
        <a href="/contact" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          Get in touch
        </a>{" "}
        and we'll put together a custom quote for you.
      </p>

    </div>
  );
}
