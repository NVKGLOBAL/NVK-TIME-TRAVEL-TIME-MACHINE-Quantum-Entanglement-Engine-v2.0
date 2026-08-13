import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
    notification: { message: string; type: 'success' | 'error' | 'info' } | null;
    onClear: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClear }) => {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                onClear();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClear]);

    const typeClasses = {
        success: 'bg-green-600/80 border-green-500',
        error: 'bg-red-600/80 border-red-500',
        info: 'bg-blue-600/80 border-blue-500',
    };
    
    const iconClasses = {
        success: 'ri-checkbox-circle-line',
        error: 'ri-error-warning-line',
        info: 'ri-information-line',
    };

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[6000] pointer-events-none">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`p-4 rounded-lg border text-white shadow-2xl flex items-center gap-3 backdrop-blur-md pointer-events-auto ${typeClasses[notification.type]}`}
                    >
                        <i className={`${iconClasses[notification.type]} text-2xl`}></i>
                        <p className="font-medium">{notification.message}</p>
                        <button onClick={onClear} className="ml-4 text-gray-200 hover:text-white">
                            <i className="ri-close-line"></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notification;