export default function Refer() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 h-[80vh] text-center max-w-3xl mx-auto">

      <div className="inline-block px-4 py-1 rounded-full bg-black text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-xl">
        Partner Program
      </div>

      <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-gray-900 to-gray-500">
        Refer & Earn
      </h1>

      <div className="text-7xl mb-8">
        💸
      </div>

      <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8">
        Earn <span className="font-black text-black">10% commission</span> on every successful client referral you send our way.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-sm text-left">
        <h3 className="font-bold text-gray-900 mb-4 tracking-tight">How it works:</h3>
        <ul className="space-y-4 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">1</span>
            <span>Connect us with a brand needing cinematic content.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">2</span>
            <span>They sign a project contract with UPSOCIALS.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">3</span>
            <span>You receive 10% of the project's total net value as long as they work with us.</span>
          </li>
        </ul>
      </div>

      <a
        href="https://wa.me/+917880533628"
        target="_blank"
        rel="noreferrer"
        className="mt-12 inline-block bg-black hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full uppercase tracking-wider text-sm transition-transform duration-300 hover:-translate-y-1 shadow-2xl">
        Get Your Link
      </a>

    </div>
  )
}
