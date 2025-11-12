
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageGenerator from './components/ImageGenerator';
import Gallery from './components/Gallery';
import Login from './components/Login';
import SignUp from './components/SignUp';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import { useTheme } from './hooks/useTheme';
import { getCurrentUser } from './services/authService';

export type Page = 'landing' | 'generator' | 'gallery' | 'models' | 'about' | 'login' | 'signup' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [theme, setTheme] = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);


  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'generator':
        return <ImageGenerator />;
      case 'gallery':
        return <Gallery />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'signup':
        return <SignUp setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />;
      case 'models':
        return <div className="text-center p-8 text-slate-700 dark:text-slate-300">Models page coming soon!</div>;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300`}>
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
