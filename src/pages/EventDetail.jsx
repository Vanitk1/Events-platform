import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../services/supabase';
import api from '../services/api';
import StripeCheckout from '../components/StripeCheckout';
import '../styles/EventDetail.css';

function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [isSignedUp, setIsSignedUp] = useState(false);

  // const checkUser = useCallback(async () => {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   
  //   if (user) {
  //     const { data } = await supabase
  //       .from('event_signups')
  //       .select('*')
  //       .eq('event_id', id)
  //       .eq('user_id', user.id)
  //       .single();
  //     
  //     if (data) setIsSignedUp(true);
  //   }
  // }, [id]);

  const fetchEvent = useCallback(async () => {
    try {
      const data = await api.getById(id);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Failed to load event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchEvent();
    // checkUser();
  }, [fetchEvent]);

  // const handleSignup = async () => {
  //   if (!user) {
  //     alert('Please log in to sign up for events');
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     await api.signup(id);
  //     setIsSignedUp(true);
  //     alert('✅ Successfully signed up for event!');
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //     alert('❌ Failed to sign up. Please try again.');
  //   }
  // };

  const addToGoogleCalendar = () => {
    const startDate = new Date(event.start_time).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(event.end_time).toISOString().replace(/-|:|\.\d+/g, '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-message" role="alert">
        <p>Event not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-detail-container">
      <button 
        onClick={() => navigate('/events')}
        className="back-button"
        aria-label="Go back to events list"
      >
        ← Back to Events
      </button>

      <div className="event-detail-card">
        {event.image_url && (
          <img 
            src={event.image_url} 
            alt={`${event.title} event banner`}
            className="event-detail-image"
          />
        )}

        <h1 aria-label={`Event title: ${event.title}`}>
          {event.title}
        </h1>

        <section 
          className="event-meta"
          aria-label="Event details"
        >
          <div className="meta-item">
            <span className="label" aria-label="Event date">📅 Date:</span>
            <span>{formatDate(event.start_time)}</span>
          </div>

          <div className="meta-item">
            <span className="label" aria-label="Event time">🕐 Time:</span>
            <span>
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </span>
          </div>

          <div className="meta-item">
            <span className="label" aria-label="Event location">📍 Location:</span>
            <span>{event.location}</span>
          </div>

          <div className="meta-item">
            <span className="label" aria-label="Event price">💷 Price:</span>
            <span>
              {parseFloat(event.price) === 0 
                ? 'Free' 
                : `£${parseFloat(event.price).toFixed(2)}`}
            </span>
          </div>
        </section>

        <section className="event-description" aria-labelledby="description-heading">
          <h2 id="description-heading">About This Event</h2>
          <p>{event.description}</p>
        </section>

        <nav className="event-actions" aria-label="Event actions">
          <button 
            onClick={addToGoogleCalendar}
            className="btn-calendar-small"
            aria-label={`Add ${event.title} to your Google Calendar`}
          >
            📅 Add to Calendar
          </button>
        </nav>

        <StripeCheckout event={event} user={user} />
      </div>
    </div>
  );
}

export default EventDetail;
