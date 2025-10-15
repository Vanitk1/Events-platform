import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('event_id');

  return (
    <div className="payment-container">
      <div className="payment-card success">
        <div className="payment-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your ticket has been purchased successfully.</p>
        <p className="session-id">Session ID: {sessionId}</p>
        
        <div className="payment-actions">
          <button 
            onClick={() => navigate(`/events/${eventId}`)}
            className="btn-primary"
          >
            View Event
          </button>
          <button 
            onClick={() => navigate('/events')}
            className="btn-secondary"
          >
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;