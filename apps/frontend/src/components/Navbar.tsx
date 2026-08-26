import React from 'react';
import { CheckSquare, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { username, theme, toggleTheme, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="brand-logo">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span>Task<span className="text-gradient">Flow</span></span>
        </div>

        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-badge">
              <div className="user-avatar">
                {username ? username.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span>{username}</span>
            </div>

            <button
              className="btn btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <button
            className="btn btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </div>
    </nav>
  );
};
