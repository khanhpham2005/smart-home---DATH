import React, { useState } from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = ({ user, onToggleSidebar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="page-title">SmartHome Control System</h2>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt="User"
              className="user-avatar"
            />
            <span className="user-name">{user?.name || 'User'}</span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-name">{user?.name}</p>
                <p className="dropdown-email">{user?.email}</p>
              </div>
              <button
                className="logout-button"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
