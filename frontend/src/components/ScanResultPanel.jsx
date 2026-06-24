import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import RiskGauge from './RiskGauge';

const categoryConfig = {
  Safe: {
    icon: ShieldCheck,
    color: 'text-neon-green',
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    badge: 'badge-safe',
  },
  Suspicious: {
    icon: ShieldAlert,
    color: 'text-neon-yellow',
    bg: 'bg-neon-yellow/10',
    border: 'border-neon-yellow/30',
    badge: 'badge-suspicious',
  },
  Phishing: {
    icon: ShieldAlert,
    color: 'text-neon-pink',
    bg: 'bg-neon-pink/10',
    border: 'border-neon-pink/30',
    badge: 'badge-phishing',
  },
};

const indicatorIcons = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  safe: CheckCircle,
};

const indicatorColors = {
  critical: 'text-red-400 bg-red-400/10',
  warning: 'text-yellow-400 bg-yellow-400/10',
  info: 'text-blue-400 bg-blue-400/10',
  safe: 'text-green-400 bg-green-400/10',
};

export default function ScanResultPanel({ result }) {
  if (!result) return null;

  const config = categoryConfig[result.category] || categoryConfig.Safe;
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <GlassCard hover={false} className={`border ${config.border}`}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Risk Gauge */}
          <div className="flex-shrink-0">
            <RiskGauge score={result.risk_score} />
          </div>

          {/* Result Details */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <CategoryIcon className={`w-8 h-8 ${config.color}`} />
              <h3 className={`text-2xl font-bold ${config.color}`}>
                {result.category}
              </h3>
            </div>

            <p className="text-gray-400 text-sm mb-4 font-mono break-all">
              {result.url}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className={config.badge}>
                {result.category}
              </span>
              <span className="text-sm text-gray-400">
                Confidence: <span className="text-white font-semibold">{result.confidence}%</span>
              </span>
            </div>

            {/* Probability Bars */}
            {result.probabilities && (
              <div className="mt-6 space-y-2">
                {[
                  { label: 'Safe', value: result.probabilities.safe, color: 'bg-neon-green' },
                  { label: 'Suspicious', value: result.probabilities.suspicious, color: 'bg-neon-yellow' },
                  { label: 'Phishing', value: result.probabilities.phishing, color: 'bg-neon-pink' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-20">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full ${color}`}
                      />
                    </div>
                    <span className="text-xs text-gray-300 w-12 text-right">{value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Threat Indicators */}
      {result.indicators && result.indicators.length > 0 && (
        <GlassCard hover={false}>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-500" />
            Threat Indicators
          </h4>
          <div className="space-y-3">
            {result.indicators.map((indicator, index) => {
              const IconComponent = indicatorIcons[indicator.type] || Info;
              const colorClass = indicatorColors[indicator.type] || indicatorColors.info;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${colorClass}`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{indicator.message}</span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
