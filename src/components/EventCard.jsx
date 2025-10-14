import { useNavigate } from 'react-router-dom';
import '../styles/EventCard.css';

function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-card" onClick={handleClick}>
      {event.image_url && (
        <div className="event-card-image">
          <img src={event.image_url} alt={event.title} />
        </div>
      )}
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        
        <div className="event-card-details">
          <div className="event-detail-item">
            <span className="icon">📅</span>
            <span>{formatDate(event.start_time)}</span>
          </div>
          
          <div className="event-detail-item">
            <span className="icon">🕐</span>
            <span>{formatTime(event.start_time)}</span>
          </div>
          
          <div className="event-detail-item">
            <span className="icon">📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        <p className="event-card-description">
          {event.description?.substring(0, 100)}
          {event.description?.length > 100 ? '...' : ''}
        </p>

        <div className="event-card-footer">
          <div className="event-price">
            {event.price === 0 || event.price === undefined ? (
              <span className="price-free">Free</span>
            ) : (
              <span className="price-paid">£{event.price.toFixed(2)}</span>
            )}
          </div>
          
          <button className="btn-view-details">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;