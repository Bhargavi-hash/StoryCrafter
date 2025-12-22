import React, { useState, useEffect } from 'react';

export default function DescriptionModal({ isOpen, onClose, initialValue = '', onSave }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Reset to initial value whenever modal opens or initialValue changes
    if (isOpen) {
      setValue(initialValue);
    }
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleClose = () => {
    // Reset to initial value when closing without saving
    setValue(initialValue);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-sm w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div 
          className="flex items-center justify-between border-b border-gray-100"
          style={{ padding: 'clamp(1rem, 1.2vw, 1.5rem) clamp(1.5rem, 2vw, 2rem)' }}
        >
          <h2 
            className="font-medium text-gray-900"
            style={{ fontSize: 'clamp(1.125rem, 1.2vw + 0.5rem, 1.5rem)' }}
          >
            Edit Description
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ width: 'clamp(1.125rem, 1.2vw, 1.5rem)', height: 'clamp(1.125rem, 1.2vw, 1.5rem)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-auto"
          style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write your story description..."
            className="w-full h-full text-gray-700 leading-relaxed resize-none"
            style={{ 
              minHeight: 'clamp(18.75rem, 20vw, 25rem)',
              fontSize: 'clamp(1rem, 1vw + 0.3rem, 1.25rem)',
              caretColor: '#000000',
              outline: 'none',
              border: 'none'
            }}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end border-t border-gray-100"
          style={{ padding: 'clamp(1rem, 1.2vw, 1.5rem) clamp(1.5rem, 2vw, 2rem)' }}
        >
          <button
            onClick={handleSave}
            className="bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            style={{
              padding: 'clamp(0.5rem, 0.7vw, 0.625rem) clamp(1.25rem, 1.5vw, 1.5rem)',
              fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
