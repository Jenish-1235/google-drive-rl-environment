import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChildAccountPage.css';

export const CreateChildAccountPage = () => {
  const navigate = useNavigate();
  const [showNameForm, setShowNameForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  const handleYesContinue = () => {
    setShowNameForm(true);
  };

  const handleNoThanks = () => {
    // Navigate back to login
    navigate('/auth/login');
  };

  return (
    <div className="create-child-account-page-container">
      {/* Main content card */}
      <div className="create-child-account-card">
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

        {!showNameForm ? (
          <>
            {/* Content Layout */}
            <div className="child-account-content">
              {/* Left side - Heading and description */}
              <div className="child-account-left">
                <h1 className="child-account-heading">Create a Google Account</h1>
                <p className="child-account-description">
                  You'll help manage this account until your child is 13 (or applicable age in your country)
                </p>
              </div>

              {/* Right side - Features list */}
              <div className="child-account-right">
                <div className="child-account-feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#e3e3e3">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="feature-text">
                    Manage your child's account and privacy settings
                  </div>
                </div>

                <div className="child-account-feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#e3e3e3">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="feature-text">
                    Set content filters for services like Google Play and Search that work when your child is signed in
                  </div>
                </div>

                <div className="child-account-feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#e3e3e3">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </div>
                  <div className="feature-text">
                    Limit screen time on supervised devices with Google Family Link. <a href="#" className="learn-more-child-link">Learn more</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="child-account-actions">
              <button className="no-thanks-btn" onClick={handleNoThanks}>
                No, thanks
              </button>
              <button className="yes-continue-btn" onClick={handleYesContinue}>
                Yes, continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Name Form */}
            <div className="child-name-form">
              <h1 className="child-account-heading">Create a Google Account</h1>
              <p className="child-account-subheading">Enter your child's name</p>

              {/* Name Inputs */}
              <div className="child-name-inputs-container">
                <div className="child-name-input-wrapper">
                  <input
                    type="text"
                    className="child-name-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="child-name-input-wrapper">
                  <input
                    type="text"
                    className="child-name-input"
                    placeholder="Surname (optional)"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="child-name-actions">
                <button className="child-next-btn">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="create-child-account-footer">
        <div className="language-selector">
          English (United Kingdom)
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
