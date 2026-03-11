import { Link, useLocation } from "react-router-dom"
import { useStore } from "../hooks/useStore"

export default function Sidebar() {
  const location = useLocation();
  const { data } = useStore();

  return (
    <div className="relative md:fixed left-0 top-0 h-auto md:h-screen w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-50">

      <div>
        <div className="mb-6 md:mb-12 flex justify-between items-center md:block">
          <div>
            <Link to="/">
              <h1 className="text-2xl tracking-tight text-gray-900 font-bold">
                upsocials
              </h1>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                modern renaissance man
              </p>
            </Link>
          </div>

          <div className="flex md:hidden space-x-2">
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center cursor-pointer">
              <span className="text-white text-[10px] font-bold">wa</span>
            </a>
            <a href="https://instagram.com/upsocials" target="_blank" rel="noreferrer" className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center cursor-pointer">
              <span className="text-white text-[10px] font-bold">ig</span>
            </a>
          </div>
        </div>

        <nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-3 text-sm text-gray-500 mb-6 md:mb-12 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Link to="/" className={`hover:text-gray-900 transition-colors shrink-0 ${location.pathname === '/' ? 'text-gray-900 font-bold' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`hover:text-gray-900 transition-colors shrink-0 ${location.pathname === '/about' ? 'text-gray-900 font-bold' : ''}`}>
            About
          </Link>
          <Link to="/pricing" className={`hover:text-gray-900 transition-colors shrink-0 ${location.pathname === '/pricing' ? 'text-gray-900 font-bold' : ''}`}>
            Pricing
          </Link>
          <Link to="/contact" className={`hover:text-gray-900 transition-colors shrink-0 ${location.pathname === '/contact' ? 'text-gray-900 font-bold' : ''}`}>
            Contact
          </Link>
          <Link to="/refer" className={`hover:text-gray-900 transition-colors shrink-0 ${location.pathname === '/refer' ? 'text-gray-900 font-bold' : ''}`}>
            Refer & Earn
          </Link>
        </nav>

        <div className="hidden md:block text-sm text-gray-500">
          <h2 className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest bg-gray-50 uppercase p-1 rounded inline-block">WORK</h2>
          <ul className="flex flex-col space-y-2 text-xs">
            {data.projects.map((project) => (
              <li key={project.id} className="max-w-full truncate">
                <Link to={`/project/${project.tag}`} className={`hover:text-gray-900 cursor-pointer transition-colors ${location.pathname === `/project/${project.tag}` ? 'text-gray-900 font-bold' : ''}`}>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hidden md:flex mt-12 space-x-3">
        <a href="https://wa.me/+917880533628" target="_blank" rel="noreferrer" className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
          <span className="text-white text-[10px] font-bold">wa</span>
        </a>
        <a href="https://instagram.com/upsocials" target="_blank" rel="noreferrer" className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
          <span className="text-white text-[10px] font-bold">ig</span>
        </a>
      </div>

    </div>
  )
}