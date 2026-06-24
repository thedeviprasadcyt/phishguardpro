import { motion } from 'framer-motion';

export default function RiskGauge({ score = 0, size = 200 }) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // Half circle
  const progress = (score / 100) * circumference;

  const getColor = (score) => {
    if (score <= 30) return '#00e676';
    if (score <= 60) return '#ffab00';
    return '#ff1744';
  };

  const getLabel = (score) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
        {/* Score text */}
        <motion.text
          x={size / 2}
          y={size / 2 - 5}
          textAnchor="middle"
          fill="white"
          fontSize="36"
          fontWeight="800"
          fontFamily="Inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          fontFamily="Inter"
        >
          / 100
        </text>
      </svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {getLabel(score)}
      </motion.div>
    </div>
  );
}
