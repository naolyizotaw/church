import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Give from './pages/Give';
import Events from './pages/Events';
import Sermons from './pages/Sermons';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/give" element={<Give />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
