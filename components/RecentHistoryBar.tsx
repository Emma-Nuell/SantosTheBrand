import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, History } from 'lucide-react';
import { Product } from '../types';

interface RecentHistoryBarProps {
  products: Product[];
  onDismiss: () => void;
}

const RecentHistoryBar: React.FC<RecentHistoryBarProps> = ({ products, onDismiss }) => {
  // Only show if we have 2 or more products visited
  if (products.length < 2) return null;

  // Show last 3 unique items
  const displayProducts = products.slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-6 p-4 bg-white/80 backdrop-blur-md shadow-2xl border border-white/40 rounded-2xl"
      >
        <div className="flex items-center gap-2 pl-2 border-r border-gray-200 pr-4">
          <History className="w-4 h-4 text-primary-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary-950">Recently Viewed</span>
        </div>

        <div className="flex items-center gap-4">
          {displayProducts.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="group relative"
            >
              <div className="w-12 h-16 rounded overflow-hidden border border-gray-100 transition-transform group-hover:scale-105 group-hover:border-primary-300">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-primary-950 text-white p-3 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                 <p className="text-[10px] font-bold uppercase truncate">{product.name}</p>
                 <p className="text-xs font-serif text-primary-200">${product.price}</p>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-primary-950 rotate-45" />
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={onDismiss}
          className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecentHistoryBar;