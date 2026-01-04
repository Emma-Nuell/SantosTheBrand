import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Info } from 'lucide-react';
import GalleryItem from '../components/GalleryItem';
import PageTransition from '../components/PageTransition';

// Gallery Data
const GALLERY_ITEMS = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1974&auto=format&fit=crop', title: 'Midnight Silk', category: 'Evening Wear', span: 'col-span-1 row-span-2' },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1287&auto=format&fit=crop', title: 'Violet Gaze', category: 'Portrait', span: 'col-span-1 row-span-1' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop', title: 'Chiffon Dreams', category: 'Editorial', span: 'col-span-1 row-span-1' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop', title: 'Sole Statement', category: 'Footwear', span: 'col-span-1 row-span-1' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', title: 'Urban Elegance', category: 'Street Style', span: 'col-span-2 row-span-2' },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1550614000-4b9519e0034a?q=80&w=1968&auto=format&fit=crop', title: 'Velvet Touch', category: 'Texture', span: 'col-span-1 row-span-1' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop', title: 'Atelier Process', category: 'Behind Scenes', span: 'col-span-1 row-span-2' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1616166330003-8e1092419538?q=80&w=2070&auto=format&fit=crop', title: 'Purple Haze', category: 'Campaign', span: 'col-span-1 row-span-1' },
];

const FILMSTRIP_IMAGES = [
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1972&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1970&auto=format&fit=crop"
];

const duplicatedImages = [...FILMSTRIP_IMAGES, ...FILMSTRIP_IMAGES];

const GalleryPage = () => {
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const [isTextureMode, setIsTextureMode] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden">

        {/* Header */}
        <div className="relative pt-32 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6"
          >
            The Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-primary-200 font-light tracking-widest uppercase text-sm"
          >
            A Visual Anthology of Style
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] md:auto-rows-[400px] gap-8">
            {GALLERY_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={item.span}
              >
                <GalleryItem
                  layoutId={item.id}
                  image={item.src}
                  title={item.title}
                  category={item.category}
                  className="w-full h-full"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsTextureMode(false);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="py-32 bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-6 mb-12 relative z-20">
            <h2 className="font-serif text-4xl text-white">Runway Moments</h2>
          </div>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity
            }}
            className="flex gap-8 pl-6 lg:pl-12 w-max"
          >
            {duplicatedImages.map((src, i) => (
              <div
                key={i}
                className="w-[80vw] md:w-[600px] aspect-video relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
              >
                <img src={src} alt="Runway" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay" />
              </div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedItem(null)}
            >
              <button
                className="absolute top-8 right-8 text-white/50 hover:text-white z-50 transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-8 h-8" />
              </button>

              <motion.div
                layoutId={selectedItem.id}
                className="relative max-w-7xl w-full h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden bg-[#1a1a1a] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative flex-1 h-full overflow-hidden transition-all duration-700 ${
                    isTextureMode ? 'scale-150 origin-center cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsTextureMode(!isTextureMode)}
                >
                  <motion.img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    animate={{ opacity: isTextureMode ? 0.3 : 0 }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen.png')] pointer-events-none mix-blend-overlay"
                  />
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 bg-[#222] p-8 border-l border-white/10 flex flex-col">
                  <div className="mb-auto">
                    <h2 className="font-serif text-3xl mb-2">{selectedItem.title}</h2>
                    <p className="text-primary-400 font-bold uppercase tracking-widest text-xs mb-8">
                      {selectedItem.category}
                    </p>
                    <p className="text-white/60 font-light leading-relaxed">
                      Captured in high fidelity. Every thread tells a story of meticulous craftsmanship and design.
                    </p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <button
                      onClick={() => setIsTextureMode(!isTextureMode)}
                      className={`w-full py-4 px-6 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest border transition-all
                        ${isTextureMode
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-white/20 text-white hover:border-primary-500'}
                      `}
                    >
                      <ZoomIn className="w-4 h-4" />
                      {isTextureMode ? 'Exit Detail View' : 'Inspect Fabric'}
                    </button>

                    <div className="flex items-center gap-3 text-xs text-white/40 justify-center">
                      <Info className="w-4 h-4" /> Click image to toggle zoom
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default GalleryPage;
