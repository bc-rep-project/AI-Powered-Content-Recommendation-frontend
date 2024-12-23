'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover, transitions } from '@/utils/animations';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
    variant?: ButtonVariant;
    className?: string;
}

const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
} as const;

export function AnimatedButton({ 
    children, 
    className = '', 
    variant = 'primary',
    ...props 
}: ButtonProps) {
    return React.createElement(motion.button, {
        className: `px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`,
        variants: buttonHover,
        initial: "initial",
        whileHover: "hover",
        whileTap: "tap",
        transition: transitions.hover,
        ...props,
        children
    });
} 