import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import locationService from '../services/locationService';
import '../styles/LocationsPage.css';

const LocationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationService.getAllLocations();
      setLocations(data);
    } catch (error) {
      toast.error('Failed to load locations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Location name is required');
      return;
    }

    try {
      if (editingId) {
        await locationService.updateLocation(editingId, formData);
        toast.success('Location updated successfully');
      } else {
        await locationService.createLocation(formData);
        toast.success('Location created successfully');
      }
      
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchLocations();
    } catch (error) {
      toast.error('Failed to save location');
      console.error(error);
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      description: location.description || '',
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await locationService.deleteLocation(id);
      toast.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      toast.error('Failed to delete location');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="locations-loading">
        <div className="spinner"></div>
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="locations-page">
      <div className="locations-header">
        <div>
          <h1>Locations</h1>
          <p className="locations-subtitle">
            Manage your home locations and rooms
          </p>
        </div>
        {!showForm && (
          <button className="btn-primary btn-add" onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Add Location
          </button>
        )}
      </div>

      {showForm && (
        <div className="locations-form">
          <h2>{editingId ? 'Edit Location' : 'New Location'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Location Name *</label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Living Room, Bedroom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Optional description for this location"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Location' : 'Create Location'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="locations-content">
        {locations.length === 0 ? (
          <div className="no-locations">
            <p>No locations yet</p>
            <p className="no-locations-hint">
              Create your first location to organize your devices
            </p>
          </div>
        ) : (
          <div className="locations-grid">
            {locations.map((location) => (
              <div key={location.id} className="location-card">
                <div className="location-header">
                  <h3>{location.name}</h3>
                  <div className="location-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(location)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(location.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {location.description && (
                  <p className="location-description">{location.description}</p>
                )}
                {location.deviceCount && (
                  <p className="location-meta">{location.deviceCount} devices</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationsPage;
