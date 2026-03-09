import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

import Sidebar from "./components/Sidebar"
import Loader from "./components/Loader"
import PageTransition from "./components/PageTransition"

import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Refer from "./pages/Refer"
import Admin from "./pages/Admin"
import Project from "./pages/Project"
import Niche from "./pages/Niche"

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/refer" element={<PageTransition><Refer /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/project/:tag" element={<PageTransition><Project /></PageTransition>} />
        <Route path="/niche/:tag" element={<PageTransition><Niche /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(() => {
    // Check if we've already loaded in this session (e.g., after an Admin reload)
    return typeof window !== 'undefined' && sessionStorage.getItem('hasLoaded') === 'true';
  });

  const handleLoaderComplete = () => {
    sessionStorage.setItem('hasLoaded', 'true');
    setIsAppLoaded(true);
  };

  return (
    <>
      <AnimatePresence>
        {!isAppLoaded && (
          <Loader key="loader" onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      <div style={{ opacity: isAppLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
        <BrowserRouter>
          <Sidebar />
          <div className="md:ml-64 p-4 md:p-8 min-h-screen relative overflow-hidden">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App