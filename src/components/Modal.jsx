import { useEffect } from 'react';

const Modal = ({ visible, type = 'info', title, message, onClose, children }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--modal-overlay, rgba(0, 0, 0, 0.5))' }}
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full p-6 ${children ? 'max-w-2xl' : 'max-w-md'}`}
        style={{ 
          background: 'var(--panel-bg)',
          color: 'var(--text-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-4">
          {getIcon()}
          {title && (
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
          )}
        </div>
        {message && (
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {message}
          </p>
        )}
        {children}
        {onClose && type !== 'loading' && !children && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              background: 'var(--button-bg)',
              color: 'var(--button-text)'
            }}
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;

