import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ProductAnatomyProps {
  image: string;
  fabricDetails: string;
  productName: string;
}

const ProductAnatomy: React.FC<ProductAnatomyProps> = ({ image, fabricDetails, productName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll within this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms - disable on mobile via CSS logic usually, 
  // but here we use media queries in style or logic. 
  // Framer Motion automatically handles resize, but we want the effect only on desktop usually.
  
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -100]); // Texture Layer
  const yMid = useTransform(scrollYProgress, [0, 1], [50, -50]);  // Main Image
  const yFront = useTransform(scrollYProgress, [0, 1], [150, -150]); // Details/Tag

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="hidden md:block relative h-[800px] bg-white overflow-hidden my-24 border-y border-gray-100">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="font-serif text-[10rem] text-gray-50 opacity-50 whitespace-nowrap">
          {productName.split(' ')[0]}
        </h2>
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-12 flex justify-center items-center">
        
        {/* Layer 1: Background Texture/Swatch */}
        <motion.div 
          style={{ y: yBack, opacity }}
          className="absolute left-20 top-32 w-64 h-80 bg-primary-50 z-10 border border-primary-100 p-8 shadow-sm"
        >
          <div className="h-full w-full border-2 border-dashed border-primary-200 flex items-center justify-center">
             <span className="font-serif text-primary-300 -rotate-90 text-xl tracking-widest">FABRIC</span>
          </div>
          <div className="absolute bottom-4 left-8 right-8 text-xs text-primary-800 font-mono">
             {fabricDetails}
          </div>
        </motion.div>

        {/* Layer 2: Main Product Image */}
        <motion.div 
          style={{ y: yMid, opacity }}
          className="relative z-20 w-[400px] h-[600px] shadow-2xl shadow-primary-900/20"
        >
          <img src={image} alt="Anatomy Base" className="w-full h-full object-cover" />
        </motion.div>

        {/* Layer 3: Detail Overlay / Tag */}
        <motion.div 
          style={{ y: yFront, opacity }}
          className="absolute right-32 bottom-48 w-56 bg-white p-6 shadow-xl z-30 border-l-4 border-primary-600"
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-widest text-primary-950">Atelier Standard</span>
          </div>
          <p className="font-serif text-xl italic text-slate-700 leading-snug">
            "Deconstructed elegance. Every stitch tells a story of heritage."
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
             <span className="font-mono text-[10px] text-slate-400">REF: 24-FW-001</span>
             <span className="font-mono text-[10px] text-slate-400">HAND FINISHED</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProductAnatomy;