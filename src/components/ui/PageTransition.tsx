'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps): React.ReactElement {
  return React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className,
    },
    children
  );
} 