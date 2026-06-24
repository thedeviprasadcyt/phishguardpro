import { Github, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: Globe,
    label: 'Portfolio',
    href: 'https://thedeviprasadcyt.vercel.app/',
    color: 'hover:text-cyber-500 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/deviprasad-muduli-13b2b1387/',
    color: 'hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/thedeviprasadcyt',
    color: 'hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]',
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            Architect: <span className="text-cyber-500 font-semibold">Devicyt</span> © 2026 | All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, label, href, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 bg-white/5 border border-white/5 transition-all duration-300 ${color}`}
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
