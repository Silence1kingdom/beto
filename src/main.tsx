import { BrowserRouter, Routes, Route } from 'react-router';
import { createRoot } from 'react-dom/client';
import { AdminProvider } from '@/contexts/AdminContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/pages/admin/Login';
import AdminRegister from '@/pages/admin/Register';
import AdminDashboard from '@/pages/admin/Dashboard';
import ProjectsAdmin from '@/pages/admin/ProjectsAdmin';
import TeamAdmin from '@/pages/admin/TeamAdmin';
import MessagesAdmin from '@/pages/admin/MessagesAdmin';
import NotFound from '@/pages/NotFound';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AdminProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="register" element={<AdminRegister />} />
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>
        </Route>
      </Routes>
    </AdminProvider>
  </BrowserRouter>
);
