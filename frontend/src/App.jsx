import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-navy-900 dark:bg-navy-950 text-white flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><History /></ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
