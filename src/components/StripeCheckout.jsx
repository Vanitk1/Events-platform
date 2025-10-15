import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/StripeCheckout.css';

function StripeCheckout({ event, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔵 Creating checkout session for:', {
        eventId: event.id,
        eventName: event.title,
        price: event.price,
        userId: user.id,
        userEmail: user.email
      });

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/create-checkout-session`,
        {
          eventId: event.id,
          eventName: event.title,
          price: event.price,
          userId: user.id,
          userEmail: user.email,
        }
      );

      console.log('✅ Session created:', data.sessionId);
      console.log('🔗 Redirecting to:', data.url);

      window.location.href = data.url;

    } catch (err) {
      console.error('❌ Payment error:', err);
      console.error('❌ Error response:', err.response?.data);
      
      setError(
        err.response?.data?.error || 
        err.message || 
        'Payment failed. Please try again.'
      );
      setLoading(false);
    }
  };

  if (!event.price || event.price === 0) {
    return null;
  }

  return (
    <div className="stripe-checkout">
      {!user ? (
        <div className="login-prompt">
          <p>Please login to purchase tickets</p>
          <button 
            onClick={() => navigate('/auth')} 
            className="btn-login"
          >
            Login / Sign Up
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-stripe-pay"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                💳 Pay £{Number(event.price).toFixed(2)}
              </>
            )}
          </button>

          {error && (
            <div className="payment-error">
              ⚠️ {error}
            </div>
          )}

          <div className="stripe-info">
            <span className="secure-badge">🔒 Secure payment by Stripe</span>
          </div>
        </>
      )}
    </div>
  );
}

export default StripeCheckout;