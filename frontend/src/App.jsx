import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Give from './pages/Give';
import GiveSuccess from './pages/GiveSuccess';
import Events from './pages/Events';
import Sermons from './pages/Sermons';
import SermonDetail from './pages/SermonDetail';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Services from './pages/Services';

import AdminLayout from './admin/components/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSermons from './admin/pages/AdminSermons';
import AdminEvents from './admin/pages/AdminEvents';
import AdminPages from './admin/pages/AdminPages';
import AdminContacts from './admin/pages/AdminContacts';
import AdminDonations from './admin/pages/AdminDonations';
import AdminSettings from './admin/pages/AdminSettings';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="sermons" element={<AdminSermons />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/give" element={<Give />} />
          <Route path="/give/success" element={<GiveSuccess />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/sermons/:id" element={<SermonDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
