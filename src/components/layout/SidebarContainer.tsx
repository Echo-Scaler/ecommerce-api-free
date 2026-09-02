import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SidebarContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  isOpen,
  onClose,
  children
}) => {
  return (
    <>
      {/*
        Mobile backdrop — always in the DOM so CSS transition works on BOTH
        open (fade-in) and close (fade-out). Visibility driven by CSS class.
      */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
        // Prevent clicks from passing through when not visible
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">API Explorer Navigation</span>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="sidebar-content-scroll">
          {children}
        </div>
      </aside>
    </>
  );
};
