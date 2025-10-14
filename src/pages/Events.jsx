import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Events.css';

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching events from Supabase...');
      const data = await api.getAll();
      console.log('Events fetched:', data);
      
      const upcoming = data.filter(event => 
        new Date(event.start_time) > new Date()
      );
      
      setEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchEvents} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/create-event')}
          aria-label="Create a new event"
        >
        Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="no-events" role="status" aria-live="polite">
          <div className="no-events-icon" aria-hidden="true">📅</div>
          <h2>No Upcoming Events</h2>
          <p>Be the first to create an event for the community!</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/create-event')}
            aria-label="Create the first event"
          >
            Create First Event
          </button>
        </div>
      ) : (
        <div className="events-grid" role="list" aria-label="List of upcoming events">
          {events.map(event => (
            <article 
              key={event.id} 
              className="event-card"
              onClick={() => navigate(`/events/${event.id}`)}
              role="listitem"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/events/${event.id}`);
                }
              }}
              aria-label={`Event: ${event.title}. ${formatDate(event.start_time)} at ${formatTime(event.start_time)}. Location: ${event.location}. ${parseFloat(event.price) === 0 ? 'Free' : `Price: £${parseFloat(event.price).toFixed(2)}`}`}
            >
              {event.image_url && (
                <div className="event-image">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="event-content">
                <h3>{event.title}</h3>
                
                <div className="event-details">
                  <div className="event-detail">
                    <span className="icon">📅</span>
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  
                  <div className="event-detail">
                    <span className="icon">🕐</span>
                    <span>{formatTime(event.start_time)}</span>
                  </div>
                  
                  <div className="event-detail">
                    <span className="icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="event-detail">
                    <span className="icon">💷 </span>
                    <span>
                      {parseFloat(event.price) === 0 
                        ? 'Free' 
                        : `£${parseFloat(event.price).toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>

                {event.description && (
                  <p className="event-description">
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...` 
                      : event.description
                    }
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;