import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState({
    autoRefreshInterval: 5,
    theme: 'light',
    notifications: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">
          Manage your preferences and device configurations
        </p>
      </div>

      <div className="settings-container">
        {/* User Profile Section */}
        <section className="settings-section">
          <h2 className="section-title">User Profile</h2>
          <div className="setting-item">
            <label>Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="setting-input disabled"
            />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="setting-input disabled"
            />
          </div>
        </section>

        {/* Application Settings */}
        <section className="settings-section">
          <h2 className="section-title">Application Settings</h2>
          
          <div className="setting-item">
            <label htmlFor="refresh">Auto-refresh Interval (seconds)</label>
            <select
              id="refresh"
              value={settings.autoRefreshInterval}
              onChange={(e) =>
                handleSettingChange('autoRefreshInterval', Number(e.target.value))
              }
              className="setting-select"
            >
              <option value={3}>3 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="setting-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (system)</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="notifications">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) =>
                  handleSettingChange('notifications', e.target.checked)
                }
              />
              Enable notifications
            </label>
          </div>
        </section>

        {/* Save Button */}
        <button className="save-settings-button" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
