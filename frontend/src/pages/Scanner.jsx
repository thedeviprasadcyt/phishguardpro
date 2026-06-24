import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Shield, Download } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ScanResultPanel from '../components/ScanResultPanel';
import { scanUrl, exportReport } from '../api/api';

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL to scan');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await scanUrl(url.trim());
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!result) return;

    setExporting(true);
    try {
      const response = await exportReport(result);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `phishguard_report_${result.risk_score}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-500 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            AI-Powered Scanner
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            URL <span className="text-gradient">Scanner</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Enter any URL to instantly analyze it for phishing threats using our machine learning engine.
          </p>
        </motion.div>

        {/* Scanner Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard hover={false} className="mb-8">
            <form onSubmit={handleScan} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  id="url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL to scan (e.g., https://example.com)"
                  className="cyber-input pl-12 text-lg"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm px-4 py-2 rounded-lg bg-red-400/10"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-3">
                <button
                  id="scan-button"
                  type="submit"
                  disabled={loading}
                  className="btn-neon flex-1 flex items-center justify-center gap-2 text-lg py-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Scan URL
                    </>
                  )}
                </button>

                {result && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={handleExportReport}
                    disabled={exporting}
                    className="px-6 py-4 rounded-xl font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    {exporting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    PDF
                  </motion.button>
                )}
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Loading Animation */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyber-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-cyber-500/40 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-t-cyber-500 animate-spin" />
              <Shield className="absolute inset-0 m-auto w-8 h-8 text-cyber-500" />
            </div>
            <p className="text-gray-400 animate-pulse">Analyzing URL for threats...</p>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && <ScanResultPanel result={result} />}
      </div>
    </div>
  );
}
