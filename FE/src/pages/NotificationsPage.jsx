import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import notificationService from '../services/notificationService';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, read, unread

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAllNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      // In DEMO_MODE, it returns empty array, which is fine
      setNotifications([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete from local state (backend delete not yet implemented)
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error(error);
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getFilteredNotifications = () => {
    if (filter === 'read') {
      return notifications.filter((n) => n.read);
    }
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'SENSOR_ALERT':
        return <AlertCircle size={20} className="icon-alert" />;
      case 'DEVICE_STATUS':
        return <Bell size={20} className="icon-info" />;
      case 'SCHEDULE_EXECUTED':
        return <CheckCircle size={20} className="icon-success" />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'SENSOR_ALERT':
        return 'alert';
      case 'DEVICE_STATUS':
        return 'info';
      case 'SCHEDULE_EXECUTED':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p className="notifications-subtitle">
            Stay updated with your smart home activities
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount} unread</div>
        )}
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>
              {notifications.length === 0
                ? 'No notifications yet'
                : 'No notifications in this category'}
            </p>
            <p className="no-notifications-hint">
              You'll see notifications here when your devices have updates
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${notification.read ? 'read' : 'unread'} ${getNotificationColor(
                  notification.type
                )}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.title || 'Notification'}</h3>
                  <p className="notification-message">
                    {notification.message || 'No message'}
                  </p>
                  <p className="notification-time">
                    {notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </p>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="btn-icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
