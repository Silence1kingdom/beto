import { Outlet } from 'react-router';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-void-black" dir="ltr" style={{ cursor: 'auto' }}>
      <AdminSidebar />
      <main
        className="min-h-screen p-8 ml-64"
        style={{ cursor: 'auto' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
