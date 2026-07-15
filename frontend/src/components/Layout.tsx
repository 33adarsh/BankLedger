import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Wallet, LayoutDashboard, CreditCard, ArrowRightLeft, BookOpen, ShieldAlert, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Wallet className="w-8 h-8" />
          <span>LedgerBank</span>
        </div>
        
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <CreditCard className="w-5 h-5" />
            Accounts
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ArrowRightLeft className="w-5 h-5" />
            Transactions
          </NavLink>
          <NavLink to="/ledger" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <BookOpen className="w-5 h-5" />
            Ledger
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ShieldAlert className="w-5 h-5" />
            Admin
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <User className="w-5 h-5" />
            Profile
          </NavLink>
        </div>

        <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
