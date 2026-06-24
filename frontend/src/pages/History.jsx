import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Download, Filter, Clock, Shield, ShieldCheck, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { getHistory, deleteHistory, exportReport } from '../api/api';

const filterOptions = ['All', 'Safe', 'Suspicious', 'Phishing'];

const categoryStyles = {
  Safe: { badge: 'badge-safe', icon: ShieldCheck, color: 'text-neon-green' },
  Suspicious: { badge: 'badge-suspicious', icon: ShieldAlert, color: 'text-neon-yellow' },
  Phishing: { badge: 'badge-phishing', icon: ShieldAlert, color: 'text-neon-pink' },
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [exportingId, setExportingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getHistory(200);
      setHistory(response.data.history || []);
    } catch (err) {
      setError('Failed to load scan history. Make sure you have scanned some URLs first.');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete record');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async (scan) => {
    setExportingId(scan.id);
    try {
      const response = await exportReport(scan);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `phishguard_report_${scan.risk_score}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export report');
    } finally {
      setExportingId(null);
    }
  };

  // Filter and search
  const filteredHistory = history.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = !searchQuery || 
      item.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading scan history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Scan <span className="text-gradient">History</span>
          </h1>
          <p className="text-gray-400">View, search, and manage your past URL scans.</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard hover={false} className="!p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="history-search"
                  type="text"
                  placeholder="Search scans by URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cyber-input pl-10 !py-2.5 text-sm"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {filterOptions.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-cyber-500/20 text-cyber-500 border border-cyber-500/30'
                        : 'text-gray-400 hover:text-white bg-white/5 border border-transparent'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-400">
          {filteredHistory.length} {filteredHistory.length === 1 ? 'result' : 'results'}
          {activeFilter !== 'All' && ` filtered by ${activeFilter}`}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <GlassCard hover={false} className="text-center py-16">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No scans found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery || activeFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start scanning URLs to build your history'}
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredHistory.map((scan, index) => {
                const style = categoryStyles[scan.category] || categoryStyles.Safe;
                const CategoryIcon = style.icon;

                return (
                  <motion.div
                    key={scan.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  >
                    <GlassCard hover={true} className="!p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Icon & URL */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${scan.category === 'Safe' ? 'bg-green-500/10' : scan.category === 'Suspicious' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                            <CategoryIcon className={`w-5 h-5 ${style.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono text-white truncate">{scan.url}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={style.badge}>{scan.category}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {scan.scanned_at ? new Date(scan.scanned_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Score & Actions */}
                        <div className="flex items-center gap-3 sm:flex-shrink-0">
                          <div className="text-right mr-2">
                            <div className={`text-lg font-bold ${style.color}`}>
                              {scan.risk_score}
                            </div>
                            <div className="text-xs text-gray-500">Risk</div>
                          </div>

                          <button
                            onClick={() => handleExport(scan)}
                            disabled={exportingId === scan.id}
                            className="p-2 rounded-lg text-gray-400 hover:text-cyber-500 bg-white/5 hover:bg-cyber-500/10 transition-all duration-300"
                            title="Export PDF"
                          >
                            {exportingId === scan.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(scan.id)}
                            disabled={deletingId === scan.id}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 transition-all duration-300"
                            title="Delete scan"
                          >
                            {deletingId === scan.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
