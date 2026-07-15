import React from 'react';
import { BookOpen } from 'lucide-react';

const Ledger: React.FC = () => {
  return (
    <div>
      <h1>Ledger History</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Double-entry ledger records.</p>

      <div className="card empty-state">
        <BookOpen className="w-12 h-12" style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
        <h2>Not Implemented in Backend</h2>
        <p style={{ maxWidth: '400px', margin: '0 auto' }}>
          The backend API does not currently expose an endpoint (e.g. <code>GET /api/ledgers</code>) to fetch the transaction history or double-entry records. 
          This page is a placeholder for when that feature is added to the backend.
        </p>
      </div>
    </div>
  );
};

export default Ledger;
