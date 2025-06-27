import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/ui/TopBar';
import { useTheme } from '../contexts/ThemeContext';

const AppLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <TopBar 
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout; 