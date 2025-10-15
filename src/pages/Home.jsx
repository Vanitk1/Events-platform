import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const allEvents = await api.getAll();
      
      const upcoming = allEvents.filter(event => 
        new Date(event.start_time) > new Date()
      );
      
      setFeaturedEvents(upcoming.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover amazing community events</h1>
          <p>Connect with your community through exciting events and activities!</p>
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Events</h2>
        
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : featuredEvents.length === 0 ? (
          <div className="no-events">
            <p>No upcoming events yet.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/create-event')}
            >
              Create the First Event
            </button>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredEvents.map(event => (
              <div 
                key={event.id} 
                className="featured-card"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.image_url && (
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="featured-image"
                  />
                )}
                <div className="featured-content">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    📅 {new Date(event.start_time).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="event-location">📍 {event.location}</p>
                  <p className="event-price">
                    {parseFloat(event.price) === 0 ? '🎉 Free' : `💷 £${parseFloat(event.price).toFixed(2)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy to Use</h3>
            <p>Create and manage events with our intuitive interface</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Community Focused</h3>
            <p>Connect with like-minded people in your area</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access events on any device, anywhere</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our community and start discovering amazing events today</p>
        <button 
          className="btn-third btn-large"
          onClick={() => navigate('/events')}
        >
          Explore All Events
        </button>
      </section>
    </div>
  );
}

export default Home;