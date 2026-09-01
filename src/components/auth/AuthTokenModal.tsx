import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  Trash2, 
  KeyRound,
  Sparkles
} from 'lucide-react';

const SAMPLE_CUSTOMER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdXN0XzQ0MDEiLCJlbWFpbCI6ImFsZXgubWVyY2VyQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzg4MzAxMjAwLCJleHAiOjE3ODgzODc2MDB9.sample-token-sig';
const SAMPLE_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbl8wMDAxIiwiZW1haWwiOiJhZG1pbkBlY29tbWVyY2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg4MzAxMjAwLCJleHAiOjE3ODgzODc2MDB9.sample-admin-token-sig';

export const AuthTokenModal: React.FC = () => {
  const { 
    token, 
    isAuthenticated, 
    saveToken, 
    clearToken, 
    isAuthModalOpen, 
    closeAuthModal 
  } = useAuth();

  const [inputToken, setInputToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setInputToken(token || '');
      setSavedSuccess(false);
    }
  }, [isAuthModalOpen, token]);

  if (!isAuthModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveToken(inputToken);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeAuthModal();
    }, 900);
  };

  const handleClear = () => {
    clearToken();
    setInputToken('');
  };

  const handleApplyPreset = (preset: string) => {
    setInputToken(preset);
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div 
        className="auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="auth-modal-title"
      >
        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-title-group">
            <div className="auth-modal-icon-badge">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 id="auth-modal-title" className="auth-modal-title">
                API Authentication
              </h2>
              <p className="auth-modal-subtitle">
                Manage Bearer token for authorized requests
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="auth-modal-close" 
            onClick={closeAuthModal}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="auth-status-box">
          <div className="auth-status-indicator">
            {isAuthenticated ? (
              <>
                <ShieldCheck size={18} className="text-emerald-400" />
                <span className="auth-status-text authenticated">
                  Authentication Token Active
                </span>
              </>
            ) : (
              <>
                <ShieldAlert size={18} className="text-amber-400" />
                <span className="auth-status-text unauthenticated">
                  No Active Token (Public Endpoints Only)
                </span>
              </>
            )}
          </div>
          {isAuthenticated && (
            <span className="auth-header-preview">
              Header: <code>Authorization: Bearer ***</code>
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="auth-modal-form">
          <div className="auth-form-field">
            <div className="auth-label-row">
              <label htmlFor="bearer-token-input" className="auth-input-label">
                Bearer Token
              </label>
              <button
                type="button"
                className="token-visibility-btn"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showToken ? 'Mask Token' : 'Show Token'}</span>
              </button>
            </div>

            <div className="auth-input-wrapper">
              <textarea
                id="bearer-token-input"
                className="auth-token-textarea"
                rows={3}
                placeholder="Paste JWT Bearer token here (e.g. eyJhbGciOi...)"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                style={{
                  WebkitTextSecurity: showToken ? 'none' : 'disc'
                } as React.CSSProperties}
              />
            </div>
            <p className="auth-input-hint">
              Stored safely in your browser localStorage. Automatically appended to protected API requests.
            </p>
          </div>

          {/* Preset Shortcuts */}
          <div className="auth-presets-section">
            <div className="auth-presets-label">
              <Sparkles size={13} />
              <span>Quick Test Presets</span>
            </div>
            <div className="auth-presets-buttons">
              <button
                type="button"
                className="preset-btn"
                onClick={() => handleApplyPreset(SAMPLE_CUSTOMER_TOKEN)}
              >
                Customer Role Token
              </button>
              <button
                type="button"
                className="preset-btn admin"
                onClick={() => handleApplyPreset(SAMPLE_ADMIN_TOKEN)}
              >
                Admin Role Token
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="auth-modal-actions">
            {isAuthenticated && (
              <button
                type="button"
                className="auth-clear-btn"
                onClick={handleClear}
              >
                <Trash2 size={15} />
                <span>Clear Token</span>
              </button>
            )}

            <div className="auth-primary-actions">
              <button
                type="button"
                className="auth-cancel-btn"
                onClick={closeAuthModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="auth-save-btn"
                disabled={!inputToken.trim() && !isAuthenticated}
              >
                {savedSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Token</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
