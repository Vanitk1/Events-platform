import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventForm from './components/EventForm';
import MyEvents from './pages/MyEvents';
import PaymentSuccess from './pages/PaymentSuccess';
import Auth from './pages/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <NavBar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail user={user} />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/create-event" element={user ? <EventForm user={user} /> : <Navigate to="/auth" />} />
            <Route path="/edit-event/:id" element={user ? <EventForm user={user} /> : <Navigate to="/auth" />} />
            <Route path="/my-events" element={user ? <MyEvents user={user} /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;