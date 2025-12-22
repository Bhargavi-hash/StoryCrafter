import React, { useState, useRef } from 'react';

export default function TagInput({ label, tags = [], onChange, placeholder = "Add tag..." }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {label && (
        <label 
          className="block font-medium text-gray-600"
          style={{ 
            fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)',
            marginBottom: 'clamp(0.5rem, 0.8vw, 0.75rem)'
          }}
        >
          {label}
        </label>
      )}
      
      <div className="flex flex-wrap mb-2" style={{ gap: 'clamp(0.5rem, 0.6vw, 0.75rem)' }}>
        {tags.map((tag, index) => (
          <div
            key={index}
            className="inline-flex items-center bg-white border border-gray-200 rounded-full text-gray-700 group hover:border-gray-300 transition-colors"
            style={{
              gap: 'clamp(0.375rem, 0.5vw, 0.5rem)',
              padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(0.75rem, 1vw, 1rem)',
              fontSize: 'clamp(0.75rem, 0.7vw + 0.2rem, 0.875rem)'
            }}
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ width: 'clamp(0.65rem, 0.6vw, 0.75rem)', height: 'clamp(0.65rem, 0.6vw, 0.75rem)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex" style={{ gap: 'clamp(0.5rem, 0.6vw, 0.75rem)' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
          style={{
            padding: 'clamp(0.5rem, 0.7vw, 0.75rem) clamp(0.75rem, 0.9vw, 1rem)',
            fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1.125rem)'
          }}
        />
        <button
          onClick={handleAddTag}
          disabled={!inputValue.trim()}
          className="text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{
            padding: 'clamp(0.5rem, 0.7vw, 0.75rem) clamp(1rem, 1.2vw, 1.25rem)',
            fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
