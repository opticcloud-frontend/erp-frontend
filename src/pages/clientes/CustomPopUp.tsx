import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  autoCloseTime?: number; 
  position?: 'center' | 'bottom-right' | 'bottom-left'; 
  type?: 'success' | 'error' | null;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  autoCloseTime = 5000, 
  position = 'bottom-right', 
  type = null, 
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime / 1000);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(autoCloseTime / 1000);

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseTime);

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isOpen, onClose, autoCloseTime]);

  if (!isOpen) return null;

  const containerClasses = position === 'center'
    ? "fixed inset-0 flex items-center justify-center bg-black/20 z-50"
    : "fixed bottom-4 left-20 z-50"; 
  const popupClasses = position === 'center'
    ? "relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
    : "relative w-80 h-50 bg-white rounded-lg shadow-lg overflow-hidden"; 

  let accentColor = "bg-blue-500";
  let iconColor = "text-blue-500";
  
  if (type === 'success') {
    accentColor = "bg-blue-500";
    iconColor = "text-blue-500";
  } else if (type === 'error') {
    accentColor = "bg-red-500";
    iconColor = "text-red-500";
  }

  const Icon = type === 'success' 
    ? CheckCircle 
    : type === 'error' 
      ? AlertCircle 
      : Clock;

  return (
    <div className={containerClasses}>
      <div className={popupClasses}>
        <div className={`absolute left-0 top-0 bottom-0 w-2 ${accentColor}`}></div>
        
        <div className="p-4 pl-6">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-start space-x-2">
            <Icon className={`${iconColor} mt-1`} size={16} />
            <div>
              <h3 className={`text-sm font-medium ${iconColor}`}>{title}</h3>
              <p className="mt-0.5 text-xs text-gray-600">{message}</p>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-400 text-right">
            Fechando em {timeLeft}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;