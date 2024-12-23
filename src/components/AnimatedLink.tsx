'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { linkHover, transitions } from '@/utils/animations';

interface AnimatedLinkProps extends Omit<React.ComponentProps<typeof Link>, 'children'> {
    children: string | JSX.Element;
}

const MotionSpan = motion.span;

export function AnimatedLink({ children, ...props }: AnimatedLinkProps) {
    return (
        <Link {...props}>
            <MotionSpan
                className="inline-block"
                variants={linkHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                transition={transitions.hover}
            >
                {children}
            </MotionSpan>
        </Link>
    );
} 