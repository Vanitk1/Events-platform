import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      }
    };

    getUser();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings</p>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p className={`role-badge role-${userRole}`}>
                {userRole || 'user'}
              </p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{new Date(user.created_at).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-update">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h2>Account Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/my-events')} 
              className="btn-secondary"
            >
              View My Events
            </button>
            {(userRole === 'staff' || userRole === 'admin') && (
              <button 
                onClick={() => navigate('/create-event')} 
                className="btn-primary"
              >
                Create New Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;