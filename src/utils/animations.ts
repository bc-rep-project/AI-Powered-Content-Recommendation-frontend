import type { Variants } from 'framer-motion';

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

export const buttonHover: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
};

export const linkHover: Variants = {
    initial: { x: 0 },
    hover: { x: 5 },
    tap: { x: -2 }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export const slideUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
};

export const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
};

export const checkmark = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 }
};

export const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export const modalVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
};

export const transitions = {
    spring: {
        type: "spring",
        stiffness: 260,
        damping: 20
    },
    smooth: {
        duration: 0.3
    },
    delayed: (delay: number) => ({
        duration: 0.3,
        delay
    }),
    hover: {
        type: "spring",
        stiffness: 400,
        damping: 17
    },
    easeInOut: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3
    }
}; 