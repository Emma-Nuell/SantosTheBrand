import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-primary-950 pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 1 }} // Slide up on enter
      />
      <motion.div
        className="fixed inset-0 z-[60] bg-primary-950 pointer-events-none"
        initial={{ scaleY: 0 }}
        exit={{ scaleY: 1 }} // Slide down on exit
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0 }}
      />
      {children}
    </>
  );
};

export default PageTransition;