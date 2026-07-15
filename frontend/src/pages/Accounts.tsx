import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface Account {
  _id: string;
  status: string;
  currency: string;
  created_at: string;
  balance?: number;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/accounts');
      const userAccounts = response.data.accounts || [];
      
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
      setError(err.response?.data?.message || 'Failed to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/accounts');
      setSuccess('New account created successfully!');
      await fetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Accounts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your bank ledger accounts.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={fetchAccounts} className="btn-secondary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleCreateAccount} className="btn-primary" disabled={creating} style={{ width: 'auto' }}>
            <PlusCircle className="w-5 h-5" /> {creating ? 'Creating...' : 'New Account'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="error-message" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{success}</div>}

      <div className="card">
        {loading && accounts.length === 0 ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any accounts yet. Click 'New Account' to create one.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Balance</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{acc._id}</td>
                    <td>{acc.currency}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '1rem',
                        backgroundColor: acc.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: acc.status === 'ACTIVE' ? 'var(--accent)' : 'var(--error)'
                      }}>
                        {acc.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{acc.balance?.toFixed(2)}</td>
                    <td>{new Date(acc.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
