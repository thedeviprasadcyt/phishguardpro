import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/scanner', label: 'Scanner' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/history', label: 'History' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-white/5 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Shield className="w-8 h-8 text-cyber-500" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">PhishGuard Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === path
                      ? 'text-cyber-500 bg-cyber-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                    <User className="w-4 h-4 text-cyber-500" />
                    <span className="text-sm text-gray-300 max-w-[120px] truncate">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-neon text-sm !px-4 !py-2"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 glass-card rounded-none border-l border-white/10 z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-cyber-500" />
                    <span className="font-bold text-gradient">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  {navLinks.map(({ path, label }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        location.pathname === path
                          ? 'text-cyber-500 bg-cyber-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <ThemeToggle />
                  {currentUser ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                        <User className="w-4 h-4 text-cyber-500" />
                        <span className="text-sm text-gray-300 truncate">
                          {currentUser.displayName || currentUser.email}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white bg-white/5 transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center btn-neon text-sm !py-2.5"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
