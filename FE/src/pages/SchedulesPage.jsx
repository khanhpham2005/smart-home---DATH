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
    cronExpression: '',
    state: 'ON',
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
      
      // Note: Individual schedule fetching is done via /actuators/{id}/schedules
      // For now, we'll show an empty list until user adds schedules
      setSchedules([]);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.actuatorId || !formData.cronExpression) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await scheduleService.createSchedule({
        actuatorId: parseInt(formData.actuatorId),
        cronExpression: formData.cronExpression,
        state: formData.state,
      });
      
      toast.success('Schedule created successfully');
      setFormData({ actuatorId: '', cronExpression: '', state: 'ON' });
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
              <label htmlFor="cronExpression">Cron Expression *</label>
              <input
                id="cronExpression"
                type="text"
                placeholder="e.g., 0 8 * * * (8 AM every day)"
                value={formData.cronExpression}
                onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
              />
              <small className="form-hint">
                Format: minute hour day month dayOfWeek
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="state">Action</label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                  setFormData({ actuatorId: '', cronExpression: '', state: 'ON' });
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
                  <p className="schedule-cron">{schedule.cronExpression}</p>
                  <p className="schedule-action">
                    Action: <span className={`state-${schedule.state}`}>{schedule.state}</span>
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
