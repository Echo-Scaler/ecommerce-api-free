import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface ApiSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ApiSearchInput: React.FC<ApiSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search endpoints (e.g. GET, /cart)...'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <div className="api-search-container">
      <div className="api-search-input-wrapper">
        <Search size={15} className="api-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="api-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search API endpoints"
        />
        {value ? (
          <button
            type="button"
            className="api-search-clear-btn"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="api-search-shortcut">⌘K</kbd>
        )}
      </div>
    </div>
  );
};
