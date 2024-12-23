import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants, transitions } from '@/utils/animations';

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Please wait...' }: LoadingOverlayProps) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                variants={overlayVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
                    variants={modalVariants}
                    transition={transitions.smooth}
                >
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-700">{message}</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 