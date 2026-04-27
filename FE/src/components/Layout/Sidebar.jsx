import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, MapPin, Clock, Bell, Settings, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Home size={20} />,
    },
    {
      path: '/devices',
      label: 'Devices',
      icon: <Zap size={20} />,
    },
    {
      path: '/locations',
      label: 'Locations',
      icon: <MapPin size={20} />,
    },
    {
      path: '/schedules',
      label: 'Schedules',
      icon: <Clock size={20} />,
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">SmartHome</h1>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
