import { motion } from 'framer-motion';
import { Shield, Cpu, Database, Lock, Globe, Layers, Code, Server } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const techStack = [
  { icon: Code, name: 'React + Vite', desc: 'Fast, modern frontend framework' },
  { icon: Server, name: 'Flask', desc: 'Python backend with REST APIs' },
  { icon: Cpu, name: 'Scikit-Learn', desc: 'ML-powered phishing detection' },
  { icon: Database, name: 'Firebase', desc: 'Auth, Firestore, and hosting' },
  { icon: Layers, name: 'Tailwind CSS', desc: 'Utility-first styling system' },
  { icon: Lock, name: 'Security', desc: 'Rate limiting, input validation, XSS protection' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Enter a URL',
    description: 'Paste any URL you want to analyze into the scanner input field.',
  },
  {
    step: '02',
    title: 'AI Analysis',
    description: 'Our ML model extracts 18+ features and runs a Random Forest classifier to detect phishing patterns.',
  },
  {
    step: '03',
    title: 'Get Results',
    description: 'Receive instant risk scores, confidence percentages, and detailed threat indicators.',
  },
  {
    step: '04',
    title: 'Take Action',
    description: 'Download PDF reports, review history, and track your security analytics on the dashboard.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-500 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            About PhishGuard Pro
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            AI-Powered <span className="text-gradient">Cybersecurity</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            PhishGuard Pro is a full-stack cybersecurity platform that uses machine learning 
            to detect phishing URLs in real-time, helping users stay safe online.
          </p>
        </motion.div>

        {/* How It Works */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-12"
          >
            How It <span className="text-gradient">Works</span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <GlassCard key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-black text-gradient mb-3">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-12"
          >
            Tech <span className="text-gradient">Stack</span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <GlassCard key={tech.name} delay={index * 0.1}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-500/10 border border-cyber-500/20">
                    <tech.icon className="w-6 h-6 text-cyber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tech.name}</h3>
                    <p className="text-sm text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Features Detail */}
        <section className="mb-20">
          <GlassCard hover={false} className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <Globe className="w-10 h-10 text-cyber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">ML-Powered Detection</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Our Random Forest classifier analyzes 18+ URL features in milliseconds.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                'URL length and structure analysis',
                'Domain reputation and TLD checking',
                'HTTPS and SSL verification',
                'Suspicious keyword detection',
                'IP address usage detection',
                'Subdomain depth analysis',
                'URL entropy calculation',
                'Special character ratio analysis',
                'Path depth and query parameters',
                'URL shortener detection',
                'At-symbol phishing detection',
                'Double-slash path obfuscation',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-500 flex-shrink-0" />
                  {feature}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm"
        >
          Built with ❤️ by <span className="text-cyber-500 font-semibold">Devicyt</span>
        </motion.div>
      </div>
    </div>
  );
}
