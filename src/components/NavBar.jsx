import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(data?.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Events Platform
        </Link>

        <button 
          className={`mobile-menu-icon ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/events" onClick={closeMobileMenu}>Browse Events</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/my-events" onClick={closeMobileMenu}>My Events</Link>
              </li>
              {(userRole === 'staff' || userRole === 'admin') && (
                <li>
                  <Link to="/create-event" onClick={closeMobileMenu}>Create Event</Link>
                </li>
              )}
              <li>
                <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="btn-signout">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth" onClick={closeMobileMenu} className="btn-signin">
                Sign In
              </Link> 
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;