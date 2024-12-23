import { motion, AnimatePresence } from 'framer-motion';
import { slideUp, transitions } from '@/utils/animations';

interface ErrorAlertProps {
    message: string;
    onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
    return (
        <AnimatePresence>
            <motion.div
                className="relative bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                role="alert"
                aria-live="polite"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitions.smooth}
            >
                <div className="flex items-center">
                    <div className="flex-shrink-0" aria-hidden="true">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm">{message}</p>
                    </div>
                    {onDismiss && (
                        <div className="ml-auto pl-3">
                            <button
                                type="button"
                                onClick={onDismiss}
                                className="inline-flex text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-sm"
                                aria-label="Dismiss error"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path 
                                        fillRule="evenodd" 
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 