import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Account {
  _id: string;
  balance?: number;
}

const Transactions: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  
  const [depositAccount, setDepositAccount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/accounts');
        setAccounts(response.data.accounts || []);
        if (response.data.accounts?.length > 0) {
          setFromAccount(response.data.accounts[0]._id);
          setDepositAccount(response.data.accounts[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProcessing(true);

    try {
      await api.post('/transactions', {
        fromAccount,
        toAccount,
        amount: parseFloat(amount),
        idempotencyKey: crypto.randomUUID()
      });
      setSuccess(`Successfully transferred ${amount} to ${toAccount}`);
      setAmount('');
      setToAccount('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProcessing(true);

    try {
      await api.post('/transactions/deposit', {
        accountId: depositAccount,
        amount: parseFloat(depositAmount)
      });
      setSuccess(`Successfully deposited ${depositAmount}.`);
      setDepositAmount('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Deposit failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Transactions</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Transfer funds or request initial deposits.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="error-message" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{success}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h2>Transfer Funds</h2>
          <form onSubmit={handleTransfer}>
            <div className="input-group">
              <label>From Account</label>
              <select className="input-field" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>{acc._id}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>To Account (ID)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Destination Account ID"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className="input-field" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={processing || accounts.length === 0}>
              {processing ? 'Processing...' : 'Send Transfer'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Deposit Funds</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Deposit funds into your account.
          </p>
          <form onSubmit={handleDeposit}>
            <div className="input-group">
              <label>Target Account</label>
              <select className="input-field" value={depositAccount} onChange={(e) => setDepositAccount(e.target.value)} required>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>{acc._id}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className="input-field" 
                placeholder="1000.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary" style={{ width: '100%' }} disabled={processing || accounts.length === 0}>
              {processing ? 'Processing...' : 'Request Deposit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
