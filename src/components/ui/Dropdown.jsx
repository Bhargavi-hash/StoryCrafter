import { useState, useRef, useEffect } from "react";

export default function Dropdown({ value, onChange, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <div ref={buttonRef} className={className}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-full text-left border border-gray-200 rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-700 bg-white hover:border-gray-300 transition-colors focus:outline-none focus:border-gray-400 flex items-center justify-between"
        >
          <span>{selectedOption?.label || 'Select...'}</span>
          <svg 
            className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{ 
            zIndex: 9999,
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm hover:bg-gray-50 transition-colors ${
                option.value === value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
