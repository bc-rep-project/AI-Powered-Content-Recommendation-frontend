'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition, transitions } from '@/utils/animations';

interface PageTransitionProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
    className?: string;
}

export function PageTransition({ 
    children, 
    className, 
    ...props 
}: PageTransitionProps) {
    return React.createElement(motion.div, {
        className,
        variants: pageTransition,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: transitions.easeInOut,
        ...props,
        children
    });
} 