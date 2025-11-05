import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import AIAssistBubble from './components/layout/AIAssistBubble';
import HomePage from './pages/HomePage';
import FeedsPage from './pages/FeedsPage';
import ManualPage from './pages/ManualPage';
import LoginPage from './pages/LoginPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <main className="pt-16"> {/* Adjust for fixed navbar */}
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/feeds" element={<FeedsPage />} />
                  <Route path="/manual/:id" element={<ManualPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <AIAssistBubble />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;