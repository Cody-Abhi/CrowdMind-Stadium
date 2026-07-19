import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  isOpen: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  isOpen
}) => {
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-state-success-text flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-state-danger-text flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-neon-blue-400 flex-shrink-0" />
  };

  const bgClasses = {
    success: 'bg-void-900 border-state-success-text/30',
    error: 'bg-void-900 border-state-danger-text/30',
    info: 'bg-void-900 border-neon-blue-500/30'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-elevation-high max-w-sm ${bgClasses[type]}`}
          role="alert"
        >
          {icons[type]}
          <p className="text-xs text-white leading-relaxed pr-6">{message}</p>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-void-500 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
