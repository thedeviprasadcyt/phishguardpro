import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Search, BarChart3, FileText, Lock, Zap, Globe, ArrowRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import GlassCard from '../components/GlassCard';

const features = [
  {
    icon: Search,
    title: 'AI URL Scanner',
    description: 'Advanced machine learning algorithms analyze URLs in real-time to detect phishing threats instantly.',
  },
  {
    icon: Shield,
    title: 'Threat Detection',
    description: '18+ feature analysis including domain patterns, SSL checks, and suspicious keyword identification.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive visual analytics with charts, trends, and risk distribution for all your scans.',
  },
  {
    icon: FileText,
    title: 'PDF Reports',
    description: 'Generate professional security reports with detailed findings and recommendations.',
  },
  {
    icon: Lock,
    title: 'Secure Auth',
    description: 'Firebase-powered authentication with session persistence and protected routes.',
  },
  {
    icon: Zap,
    title: 'Real-time Results',
    description: 'Get instant predictions with confidence scores and actionable threat indicators.',
  },
];

const stats = [
  { value: '99.2%', label: 'Detection Accuracy' },
  { value: '<1s', label: 'Scan Speed' },
  { value: '18+', label: 'URL Features' },
  { value: '24/7', label: 'Protection' },
];

export default function Home() {
  return (
    <div className="relative">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-500 text-sm font-medium mb-8">
                <Shield className="w-4 h-4" />
                AI-Powered Cybersecurity Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              Detect Phishing
              <br />
              <span className="text-gradient">Before It Strikes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            >
              PhishGuard Pro uses advanced machine learning to analyze URLs in real-time,
              providing instant phishing detection with confidence scores and threat indicators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/scanner" className="btn-neon text-lg px-8 py-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Scan a URL
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-xl text-lg font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enterprise-Grade <span className="text-gradient">Security Features</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to protect yourself and your organization from phishing attacks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyber-500/10 border border-cyber-500/20">
                    <feature.icon className="w-6 h-6 text-cyber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard hover={false} className="text-center p-12 border border-cyber-500/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Globe className="w-12 h-12 text-cyber-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Start Protecting Your Digital Identity
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Join PhishGuard Pro today and get real-time protection against phishing attacks.
              </p>
              <Link
                to="/register"
                className="btn-neon inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
