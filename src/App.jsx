import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sun, Moon, LogIn, LogOut } from "lucide-react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthenticationModal from "./components/AuthenticationModal";
import { fetchCurrentUser, logout, selectIsAuthenticated, selectUser } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleAuthClick = () => {
    if (isAuthenticated) {
      dispatch(logout());
    } else {
      setShowAuthModal(true);
    }
  };
  
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-2xl font-bold"
            >
              TaskFlow
            </motion.div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAuthClick}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onShowAuth={() => setShowAuthModal(true)} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-surface-500">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
      
      <AuthenticationModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal} 
      />
    </div>
  );
}

export default App;