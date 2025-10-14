import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

function NavBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out');
    }
  };

  const handleSignIn = async () => {
    try {
      const redirectUrl = 'http://localhost:5173';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Sign in error:', error);
        alert(`Sign in failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#007bff', 
      color: 'white',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Community Events
        </Link>
        <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>
        Events
        </Link>
        <Link to="/create-event" style={{ color: 'white', textDecoration: 'none' }}>
        Create Event
        </Link>
        {user && (
          <Link to="/my-events" style={{ color: 'white', textDecoration: 'none' }}>
          My Events
          </Link>
        )}
      </div>
      
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
            <button 
              onClick={handleSignOut}
              style={{ 
                padding: '0.5rem 1rem', 
                background: 'white', 
                color: '#007bff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
            Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSignIn}
            style={{ 
              padding: '0.5rem 1.5rem', 
              background: 'white', 
              color: '#007bff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
          Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;