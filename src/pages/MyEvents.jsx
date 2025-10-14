import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import api from '../services/api';
import '../styles/MyEvents.css';

function MyEvents() {
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyEvents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      const allEvents = await api.getAll();
      const userEvents = allEvents.filter(event => event.created_by === user.id);
      setMyEvents(userEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load your events');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(eventId);
      
      setMyEvents(myEvents.filter(event => event.id !== eventId));
      
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="my-events-container">
        <div className="loading">Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-events-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h1>My Events</h1>
        <button 
          className="btn-create"
          onClick={() => navigate('/create-event')}
        >
          Create New Event
        </button>
      </div>

      {myEvents.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any events yet.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/create-event')}
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {myEvents.map(event => (
            <div key={event.id} className="my-event-card">
              {event.image_url && (
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="event-image"
                />
              )}
              
              <div className="event-content">
                <h3>{event.title}</h3>
                
                <div className="event-info">
                  <p>📅 {new Date(event.start_time).toLocaleDateString('en-GB')}</p>
                  <p>🕐 {new Date(event.start_time).toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</p>
                  <p>📍 {event.location}</p>
                  <p>💰 {parseFloat(event.price) === 0 ? 'Free' : `£${parseFloat(event.price).toFixed(2)}`}</p>
                </div>

                <div className="event-actions">
                  <button 
                    className="btn-view"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View
                  </button>
                  
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(event.id)}
                  >
                    Edit
                  </button>
                  
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;