import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventForm from './components/EventForm';
import MyEvents from './pages/MyEvents';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<EventForm />} />
          <Route path="/edit-event/:id" element={<EventForm />} />
          <Route path="/my-events" element={<MyEvents />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;