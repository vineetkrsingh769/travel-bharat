import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SiteHeader    from './components/SiteHeader';
import SiteFooter    from './components/SiteFooter';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home        from './pages/Home';
import States      from './pages/States';
import StateDetail from './pages/StateDetail';
import Places      from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import About       from './pages/About';
import NotFound    from './pages/NotFound';

// Admin pages
import Login       from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard   from './pages/admin/Dashboard';
import PlacesList  from './pages/admin/PlacesList';
import PlaceForm   from './pages/admin/PlaceForm';
import StatesList  from './pages/admin/StatesList';
import StateForm   from './pages/admin/StateForm';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/states"        element={<States />} />
          <Route path="/states/:slug"  element={<StateDetail />} />
          <Route path="/places"        element={<Places />} />
          <Route path="/places/:slug"  element={<PlaceDetail />} />
          <Route path="/about"         element={<About />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes — no public header/footer */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard"   element={<Dashboard />} />
                    <Route path="places"       element={<PlacesList />} />
                    <Route path="places/new"   element={<PlaceForm />} />
                    <Route path="places/:id"   element={<PlaceForm />} />
                    <Route path="states"       element={<StatesList />} />
                    <Route path="states/new"   element={<StateForm />} />
                    <Route path="states/:id"   element={<StateForm />} />
                    <Route index              element={<Dashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Public routes */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
