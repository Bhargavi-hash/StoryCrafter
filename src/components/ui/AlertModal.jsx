export default function AlertModal({ isOpen, onClose, onConfirm, title, message, type = "confirm" }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-20"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-sm border border-gray-200 max-w-md w-full"
        style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
      >
        <h3 
          className="font-medium text-gray-900"
          style={{ 
            fontSize: 'clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)',
            marginBottom: 'clamp(0.5rem, 0.8vw, 0.75rem)'
          }}
        >
          {title}
        </h3>
        
        <p 
          className="text-gray-600 leading-relaxed"
          style={{ 
            fontSize: 'clamp(1rem, 1vw + 0.3rem, 1.25rem)',
            marginBottom: 'clamp(1.5rem, 2vw, 2rem)'
          }}
        >
          {message}
        </p>
        
        <div className="flex justify-end" style={{ gap: 'clamp(0.5rem, 0.8vw, 0.75rem)' }}>
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{
                padding: 'clamp(0.5rem, 0.7vw, 0.625rem) clamp(1rem, 1.2vw, 1.25rem)',
                fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            style={{
              padding: 'clamp(0.5rem, 0.7vw, 0.625rem) clamp(1rem, 1.2vw, 1.25rem)',
              fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
            }}
          >
            {type === "confirm" ? "Continue" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
