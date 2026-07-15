import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRightLeft } from 'lucide-react';

interface Account {
  _id: string;
  status: string;
  currency: string;
  balance?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/accounts');
        const userAccounts = response.data.accounts || [];
        
        // Fetch balance for each account
        const accountsWithBalance = await Promise.all(
          userAccounts.map(async (acc: Account) => {
            try {
              const balRes = await api.get(`/accounts/balance/${acc._id}`);
              return { ...acc, balance: balRes.data.balance };
            } catch {
              return { ...acc, balance: 0 };
            }
          })
        );
        
        setAccounts(accountsWithBalance);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Here is an overview of your ledger.</p>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/accounts" className="btn-primary" style={{ width: 'auto' }}>
          <PlusCircle className="w-5 h-5" /> Manage Accounts
        </Link>
        <Link to="/transactions" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowRightLeft className="w-5 h-5" /> New Transaction
        </Link>
      </div>

      <h2>Your Accounts</h2>
      {loading ? (
        <p>Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="card empty-state">
          <p>You don't have any accounts yet.</p>
          <Link to="/accounts" style={{ marginTop: '1rem', display: 'inline-block' }}>Create your first account</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {accounts.map((acc) => (
            <div key={acc._id} className="card balance-card">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Account ID</p>
              <p style={{ fontFamily: 'monospace', marginBottom: '1rem', fontSize: '0.75rem' }}>{acc._id}</p>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Available Balance ({acc.currency})</p>
              <p className="balance-amount">{acc.balance?.toFixed(2)}</p>
              
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '1rem',
                  backgroundColor: acc.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: acc.status === 'ACTIVE' ? 'var(--accent)' : 'var(--error)'
                }}>
                  {acc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
