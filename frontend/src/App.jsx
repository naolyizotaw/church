import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Give from './pages/Give';
import Events from './pages/Events';
import Sermons from './pages/Sermons';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Services from './pages/Services';

import AdminLayout from './admin/components/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';

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
        </Route>

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/give" element={<Give />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
