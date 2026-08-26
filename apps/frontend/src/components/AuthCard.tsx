import React, { useState } from 'react';
import { User, Lock, ArrowRight, CheckSquare } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AuthCardProps {
  onSuccess: (msg: string) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        const res = await api.signin(usernameInput.trim(), passwordInput.trim());
        login(res.token, usernameInput.trim());
        onSuccess('Welcome back! Successfully logged in.');
      } else {
        const res = await api.signup(usernameInput.trim(), passwordInput.trim());
        login(res.token, usernameInput.trim());
        onSuccess('Account created successfully! Welcome to TaskFlow.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="logo-badge">
            <CheckSquare size={28} />
          </div>
          <h2>Task<span className="text-gradient">Flow</span></h2>
          <p>{isLoginTab ? 'Sign in to access your dashboard' : 'Create a new account to get started'}</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg(null);
            }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg(null);
            }}
            type="button"
          >
            Create Account
          </button>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="input-control input-control-icon"
                placeholder="e.g. alex_dev"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
              <User size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                className="input-control input-control-icon"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
