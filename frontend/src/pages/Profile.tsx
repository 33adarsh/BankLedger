import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your personal information and settings.</p>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border)' }}>
            <User className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>ID: {user?._id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <Mail className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</p>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <Shield className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Security Status</p>
              <p style={{ color: 'var(--accent)' }}>Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
