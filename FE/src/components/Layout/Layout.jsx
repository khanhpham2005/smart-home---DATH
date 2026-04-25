import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Settings, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/authService';
import Sidebar from './Sidebar';
import Header from './Header';
import '../Layout/Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-main">
        <Header
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
