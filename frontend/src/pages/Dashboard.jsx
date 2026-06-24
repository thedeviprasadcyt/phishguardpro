import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Shield, ShieldCheck, ShieldAlert, Activity, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import GlassCard from '../components/GlassCard';
import { getStats } from '../api/api';
import { useAuth } from '../context/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Chart.js global defaults for dark theme
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.05)';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data.stats);
    } catch (err) {
      setError('Failed to load dashboard data. Please try scanning some URLs first.');
      // Set default stats for demo
      setStats({
        total_scans: 0,
        safe_count: 0,
        suspicious_count: 0,
        phishing_count: 0,
        weekly_trend: [],
        risk_distribution: { safe: 0, suspicious: 0, phishing: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      icon: Activity,
      label: 'Total Scans',
      value: stats.total_scans,
      color: 'text-cyber-500',
      bg: 'bg-cyber-500/10',
      border: 'border-cyber-500/20',
    },
    {
      icon: ShieldCheck,
      label: 'Safe URLs',
      value: stats.safe_count,
      color: 'text-neon-green',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      icon: ShieldAlert,
      label: 'Suspicious URLs',
      value: stats.suspicious_count,
      color: 'text-neon-yellow',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    {
      icon: Shield,
      label: 'Phishing URLs',
      value: stats.phishing_count,
      color: 'text-neon-pink',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  ] : [];

  // Weekly Trend Chart
  const weeklyChartData = {
    labels: stats?.weekly_trend?.map(t => t.date.slice(5)) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Scans',
        data: stats?.weekly_trend?.map(t => t.count) || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#00d4ff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  // Risk Distribution Doughnut
  const doughnutData = {
    labels: ['Safe', 'Suspicious', 'Phishing'],
    datasets: [
      {
        data: [
          stats?.risk_distribution?.safe || 0,
          stats?.risk_distribution?.suspicious || 0,
          stats?.risk_distribution?.phishing || 0,
        ],
        backgroundColor: [
          'rgba(0, 230, 118, 0.8)',
          'rgba(255, 171, 0, 0.8)',
          'rgba(255, 23, 68, 0.8)',
        ],
        borderColor: [
          'rgba(0, 230, 118, 1)',
          'rgba(255, 171, 0, 1)',
          'rgba(255, 23, 68, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  // Category Bar Chart
  const barData = {
    labels: ['Safe', 'Suspicious', 'Phishing'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats?.safe_count || 0,
          stats?.suspicious_count || 0,
          stats?.phishing_count || 0,
        ],
        backgroundColor: [
          'rgba(0, 230, 118, 0.6)',
          'rgba(255, 171, 0, 0.6)',
          'rgba(255, 23, 68, 0.6)',
        ],
        borderColor: [
          '#00e676',
          '#ffab00',
          '#ff1744',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400">
            Welcome back, {currentUser?.displayName || currentUser?.email || 'User'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <GlassCard key={card.label} delay={index * 0.1} className={`border ${card.border}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`text-2xl font-bold ${card.color}`}
                  >
                    {card.value}
                  </motion.div>
                  <div className="text-xs text-gray-400">{card.label}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Trend */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyber-500" />
              <h3 className="text-lg font-semibold">Weekly Scan Trends</h3>
            </div>
            <div className="h-64">
              <Line data={weeklyChartData} options={weeklyChartOptions} />
            </div>
          </GlassCard>

          {/* Risk Distribution */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-cyber-500" />
              <h3 className="text-lg font-semibold">Risk Distribution</h3>
            </div>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </GlassCard>
        </div>

        {/* Category Breakdown */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-cyber-500" />
            <h3 className="text-lg font-semibold">Category Breakdown</h3>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
