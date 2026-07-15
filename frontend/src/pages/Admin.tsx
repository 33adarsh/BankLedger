import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage users and system settings.</p>

      <div className="card empty-state">
        <ShieldAlert className="w-12 h-12" style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
        <h2>Admin API Endpoints Missing</h2>
        <p style={{ maxWidth: '500px', margin: '0 auto' }}>
          While the backend supports the concept of a <code>system_user</code> and blacklisting on the database level, it does not currently expose any API endpoints to list users, manage roles, or toggle blacklists.
        </p>
      </div>
    </div>
  );
};

export default Admin;
