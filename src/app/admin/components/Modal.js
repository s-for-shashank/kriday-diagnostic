'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      case 'full': return 'max-w-[95vw]';
      default: return 'max-w-2xl';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className={`relative bg-white/10 backdrop-blur-2xl rounded-2xl w-full ${getSizeClasses()} max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl animate-modal-up`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            {title && (
              <h3 className="text-2xl font-bold text-white">{title}</h3>
            )}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group ml-auto"
                aria-label="Close modal"
              >
                <X size={20} className="text-white group-hover:text-red-400 transition-colors duration-300" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-modal-up {
          animation: modalUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

// Specialized Modal Components
export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default" // default, danger, success
}) {
  const getButtonStyles = () => {
    switch(type) {
      case 'danger': 
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 'success': 
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      default: 
        return 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700';
    }
  };

  const getIconColor = () => {
    switch(type) {
      case 'danger': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 ${getIconColor()}`}>
          <div className="text-2xl">
            {type === 'danger' ? '⚠️' : type === 'success' ? '✅' : '❓'}
          </div>
        </div>
        
        <p className="text-white/80 mb-6 text-lg leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105 ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Loading Modal
export function LoadingModal({ isOpen, message = "Loading..." }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      showCloseButton={false} 
      closeOnOverlayClick={false}
      size="sm"
    >
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </Modal>
  );
}