import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://picsum.photos/id/447/1920/1080", // Moody purple vibes usually found here
    subtitle: "The Autumn Collection",
    title: "Nocturnal Elegance",
    description: "Discover the depth of deep violet velvet and midnight silk.",
    cta: "Shop The Collection",
    link: "/shop"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/106/1920/1080",
    subtitle: "New Arrivals",
    title: "Soft Lavender Dreams",
    description: "Embrace delicate hues and flowing silhouettes for the season.",
    cta: "Explore Arrivals",
    link: "/shop"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/342/1920/1080",
    subtitle: "Limited Edition",
    title: "The Amethyst Gala",
    description: "Exquisite evening wear designed to captivate and enchant.",
    cta: "View Gallery",
    link: "/shop"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-primary-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
           <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
                exit: { opacity: 0, x: 50, transition: { duration: 0.5 } }
              }}
            >
              <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                <span className="inline-block py-1 px-3 border border-primary-300/30 rounded-full text-primary-200 text-xs tracking-[0.2em] uppercase mb-4 backdrop-blur-sm">
                  {slides[currentSlide].subtitle}
                </span>
              </motion.div>

              <motion.h2 
                variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
                className="font-serif text-5xl md:text-7xl text-white font-bold mb-6 leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p 
                variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
                className="text-lg text-primary-100/90 mb-10 leading-relaxed font-light"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}>
                <Link 
                  to={slides[currentSlide].link}
                  className="group inline-flex items-center gap-3 bg-white text-primary-950 px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary-100 transition-colors"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Progress / Pagination */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-0.5 transition-all duration-500 ${
                currentSlide === index ? 'w-16 bg-white' : 'w-8 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;