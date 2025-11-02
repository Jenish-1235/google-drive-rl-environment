import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPage.css';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordScreen, setShowPasswordScreen] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleNextClick = () => {
    if (email.trim()) {
      setShowPasswordScreen(true);
    }
  };

  const handlePasswordSubmit = () => {
    // For demo purposes, let's use a simple password check
    // In a real app, this would validate against a backend
    const CORRECT_PASSWORD = 'password123'; // Demo password
    
    if (password === CORRECT_PASSWORD) {
      // Correct password - redirect to home/drive
      navigate('/drive');
    } else {
      // Wrong password - show error
      setPasswordError(true);
    }
  };

  // Clear error when user starts typing
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCreateAccountOpen(false);
      }
    };

    if (createAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [createAccountOpen]);

  return (
    <div className="auth-page-container">
      {/* Main content card */}
      <div className="auth-card">
        {/* Google Logo */}
        <div className="logo-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 40 48"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M39.2 24.45c0-1.55-.16-3.04-.43-4.45H20v8h10.73c-.45 2.53-1.86 4.68-4 6.11v5.05h6.5c3.78-3.48 5.97-8.62 5.97-14.71z"
            />
            <path
              fill="#34A853"
              d="M20 44c5.4 0 9.92-1.79 13.24-4.84l-6.5-5.05C24.95 35.3 22.67 36 20 36c-5.19 0-9.59-3.51-11.15-8.23h-6.7v5.2C5.43 39.51 12.18 44 20 44z"
            />
            <path
              fill="#FABB05"
              d="M8.85 27.77c-.4-1.19-.62-2.46-.62-3.77s.22-2.58.62-3.77v-5.2h-6.7C.78 17.73 0 20.77 0 24s.78 6.27 2.14 8.97l6.71-5.2z"
            />
            <path
              fill="#E94235"
              d="M20 12c2.93 0 5.55 1.01 7.62 2.98l5.76-5.76C29.92 5.98 25.39 4 20 4 12.18 4 5.43 8.49 2.14 15.03l6.7 5.2C10.41 15.51 14.81 12 20 12z"
            />
          </svg>
        </div>

        {!showPasswordScreen ? (
          <>
            {/* Heading */}
            <h1 className="sign-in-heading">Sign in</h1>
            <p className="sign-in-subheading">to continue to Google Drive</p>

            {/* Email Input */}
            <div className="input-container">
              <input
                type="email"
                className="email-input"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNextClick();
                  }
                }}
              />
            </div>

            {/* Forgot email link */}
            <Link to="/auth/forgot-email" className="forgot-email-link">
              Forgot email?
            </Link>

            {/* Guest mode info */}
            <div className="guest-mode-info">
              Not your computer? Use Guest mode to sign in privately.{' '}
              <a href="#" className="learn-more-link">
                Learn more about using Guest mode
              </a>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              <div className="create-account-wrapper" ref={dropdownRef}>
                <button
                  className="create-account-btn"
                  onClick={() => setCreateAccountOpen(!createAccountOpen)}
                >
                  Create account
                </button>
                {createAccountOpen && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setCreateAccountOpen(false);
                        navigate('/auth/create-account');
                      }}
                    >
                      For my personal use
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setCreateAccountOpen(false);
                        navigate('/auth/create-child-account');
                      }}
                    >
                      For my child
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setCreateAccountOpen(false);
                        navigate('/auth/business-account');
                      }}
                    >
                      For work or my business
                    </div>
                  </div>
                )}
              </div>
              <button className="next-btn" onClick={handleNextClick}>Next</button>
            </div>
          </>
        ) : (
          <>
            {/* Welcome screen - Password entry */}
            <h1 className="welcome-heading">Welcome</h1>
            
            {/* Email display with change option */}
            <div className="email-display-container">
              <div className="email-display">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#e3e3e3" style={{ marginRight: '8px' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span className="email-text">{email}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="#e3e3e3"
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`email-input ${passwordError ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
              {passwordError && (
                <div className="password-error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#d93025" style={{ marginRight: '8px', flexShrink: 0 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>
                    Wrong password. Try again or click <span className="error-link">Forgot password</span> to reset it.
                  </span>
                </div>
              )}
            </div>

            {/* Show password checkbox */}
            <div className="show-password-container">
              <label className="show-password-label">
                <input
                  type="checkbox"
                  className="show-password-checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span className="show-password-text">Show password</span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="action-buttons password-actions">
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
              <button className="next-btn" onClick={handlePasswordSubmit}>Next</button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="auth-footer">
        <div className="language-selector" onClick={() => setLanguageOpen(!languageOpen)}>
          English (United States)
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 9L1.5 4.5h9L6 9z" />
          </svg>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Help</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
        </div>
      </div>
    </div>
  );
};
