import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <motion.img 
          src="/santos-logo.png" 
          alt="SANTOS" 
          className="w-32 h-32 object-contain mx-auto"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.8, 1, 0.8],
            filter: ["drop-shadow(0 0 0px rgba(168,85,247,0))", "drop-shadow(0 0 10px rgba(168,85,247,0.5))", "drop-shadow(0 0 0px rgba(168,85,247,0))"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;