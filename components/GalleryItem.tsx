import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

interface GalleryItemProps {
  image: string;
  title: string;
  category: string;
  className?: string;
  onClick: () => void;
  layoutId: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ 
  image, 
  title, 
  category, 
  className = "", 
  onClick,
  layoutId
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Tilt transforms
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Magnetic Caption Position
  const captionX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const captionY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalize mouse position from -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    
    const xPct = (mouseXVal / width) - 0.5;
    const yPct = (mouseYVal / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-none perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      <motion.div
        layoutId={layoutId}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        className="w-full h-full relative overflow-hidden bg-gray-900 shadow-xl transition-all duration-500 ease-out"
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-luxury scale-105"
        />

        {/* The Santos Hover Overlay */}
        <div className={`absolute inset-0 bg-primary-500/30 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Watermark Logo */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${isHovered ? 'opacity-40 scale-100' : 'opacity-0 scale-75'}`}>
          <img src="/santos-logo.png" alt="" className="w-1/3 h-1/3 object-contain invert brightness-0" />
        </div>

        {/* View Indicator */}
        <div className={`absolute top-4 right-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <Maximize2 className="w-6 h-6 drop-shadow-md" />
        </div>
      </motion.div>

      {/* Magnetic Caption */}
      <motion.div
        style={{ x: captionX, y: captionY }}
        className={`absolute bottom-8 left-8 z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-2xl border-l-2 border-primary-600">
           <h3 className="font-serif text-lg text-primary-950 leading-none">{title}</h3>
           <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mt-1">{category}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GalleryItem;