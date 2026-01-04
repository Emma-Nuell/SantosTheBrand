import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Error404 = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-primary-950 flex items-center justify-center relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/50 pointer-events-none" />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <h1 className="font-serif text-[120px] md:text-[200px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-50 font-bold">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">This Look is Out of Stock</h2>
            <p className="text-primary-200 text-lg font-light mb-12 max-w-md mx-auto">
              The page you are looking for seems to be lost in style. Let's get you back to the collection.
            </p>

            <Link 
              to="/"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-primary-950 text-sm font-bold uppercase tracking-widest overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Homepage
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Error404;