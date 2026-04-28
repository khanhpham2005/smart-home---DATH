import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Trash2, Clock } from 'lucide-react';
import scheduleService from '../services/scheduleService';
import actuatorService from '../services/actuatorService';
import '../styles/SchedulesPage.css';

const SchedulesPage = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    actuatorId: '',
    mode: 'DAILY',
    time: '08:00',
    days: [1, 2, 3, 4, 5],
    action: 'ON',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all actuators for the form
      const actuatorsList = await actuatorService.getAllActuators();
      setActuators(actuatorsList);
      
      // Fetch all schedules for all actuators
      const allSchedules = [];
      for (const actuator of actuatorsList) {
        try {
          const schedules = await actuatorService.getSchedules(actuator.id);
          if (schedules && schedules.length > 0) {
            allSchedules.push(...schedules);
          }
        } catch (error) {
          console.warn(`Failed to fetch schedules for actuator ${actuator.id}`, error);
        }
      }
      setSchedules(allSchedules);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.actuatorId || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const [hours, minutes] = formData.time.split(':');
      const timeString = `${hours}:${minutes}:00`;
      
      await scheduleService.createSchedule({
        actuatorId: parseInt(formData.actuatorId),
        mode: formData.mode,
        time: timeString,
        days: formData.mode === 'WEEKLY' ? formData.days : [],
        action: formData.action,
      });
      
      toast.success('Schedule created successfully');
      setFormData({ actuatorId: '', mode: 'DAILY', time: '08:00', days: [1,2,3,4,5], action: 'ON' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to create schedule');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      await scheduleService.deleteSchedule(id);
      toast.success('Schedule deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete schedule');
      console.error(error);
    }
  };

  const getActuatorName = (actuatorId) => {
    const actuator = actuators.find((a) => a.id === actuatorId);
    return actuator ? actuator.name : `Actuator ${actuatorId}`;
  };

  if (loading) {
    return (
      <div className="schedules-loading">
        <div className="spinner"></div>
        <p>Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="schedules-page">
      <div className="schedules-header">
        <div>
          <h1>Schedules</h1>
          <p className="schedules-subtitle">
            Automate your smart home with scheduled actions
          </p>
        </div>
        {!showForm && (
          <button className="btn-primary btn-add" onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Add Schedule
          </button>
        )}
      </div>

      {showForm && (
        <div className="schedules-form">
          <h2>Create New Schedule</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="actuatorId">Actuator *</label>
              <select
                id="actuatorId"
                value={formData.actuatorId}
                onChange={(e) => setFormData({ ...formData, actuatorId: e.target.value })}
              >
                <option value="">Select an actuator...</option>
                {actuators.map((actuator) => (
                  <option key={actuator.id} value={actuator.id}>
                    {actuator.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mode">Schedule Mode *</label>
              <select
                id="mode"
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                <option value="ONCE">Once</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            {formData.mode === 'WEEKLY' && (
              <div className="form-group">
                <label>Days of Week</label>
                <div className="days-selector">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <label key={index} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.days.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, days: [...formData.days, index] });
                          } else {
                            setFormData({ ...formData, days: formData.days.filter(d => d !== index) });
                          }
                        }}
                      />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="action">Action *</label>
              <select
                id="action"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              >
                <option value="ON">Turn ON</option>
                <option value="OFF">Turn OFF</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Create Schedule
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ actuatorId: '', mode: 'DAILY', time: '08:00', days: [1,2,3,4,5], action: 'ON' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="schedules-content">
        {schedules.length === 0 ? (
          <div className="no-schedules">
            <Clock size={48} />
            <p>No schedules yet</p>
            <p className="no-schedules-hint">
              Create a schedule to automate your devices
            </p>
          </div>
        ) : (
          <div className="schedules-list">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="schedule-card">
                <div className="schedule-info">
                  <h3>{getActuatorName(schedule.actuatorId)}</h3>
                  <p className="schedule-mode">
                    <strong>{schedule.mode}</strong> at {schedule.time.slice(0, 5)}
                  </p>
                  {schedule.mode === 'WEEKLY' && schedule.days.length > 0 && (
                    <p className="schedule-days">
                      Days: {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        .filter((_, i) => schedule.days.includes(i))
                        .join(', ')}
                    </p>
                  )}
                  <p className="schedule-action">
                    Action: <span className={`state-${schedule.action}`}>{schedule.action}</span>
                  </p>
                </div>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(schedule.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulesPage;
