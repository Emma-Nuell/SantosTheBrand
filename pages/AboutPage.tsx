import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, animate } from 'framer-motion';
import TextReveal from '../components/TextReveal';
import PageTransition from '../components/PageTransition';
import SpotlightEffect from '../components/SpotlightEffect';

const VALUES = [
  {
    title: "Quality",
    description: "We source only the finest mulberry silk and Italian wools, ensuring every garment feels as exceptional as it looks.",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop"
  },
  {
    title: "Sustainability",
    description: "Conscious luxury is our promise. Our production processes minimize waste and prioritize ethical labor.",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Craftsmanship",
    description: "Every seam is finished by hand. Our master tailors bring decades of expertise to the modern silhouette.",
    image: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=2064&auto=format&fit=crop"
  }
];

const AboutPage = () => {
  const containerRef = useRef(null);

  const [position, setPosition] = useState(0);

  useEffect(() => {
    const controls = animate(position, -100, {
      duration: 20,
      ease: "linear",
      repeat: Infinity,
      onUpdate: (latest) => setPosition(latest),
    });

    return controls.stop;
  }, []);

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        
        {/* Split Hero with Spotlight */}
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-primary-50">
            <div className="max-w-xl">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-primary-500 mb-6 block"
              >
                Since 1985
              </motion.span>
              <TextReveal className="font-serif text-5xl md:text-7xl text-primary-950 mb-8 leading-tight">
                The Santos Story
              </TextReveal>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-slate-600 text-lg leading-relaxed font-light"
              >
                Born from a desire to redefine modern elegance, Santos blends timeless silhouettes with contemporary boldness. 
                We believe that luxury is not just what you wear, but how you feel when you wear it.
              </motion.p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden bg-black">
            <SpotlightEffect className="w-full h-full">
              <motion.img 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" 
                alt="Fashion Model" 
                className="w-full h-full object-cover"
              />
            </SpotlightEffect>
          </div>
        </div>

        <section ref={containerRef} className="py-32 overflow-hidden bg-primary-950 text-white">
          <div className="max-w-[1440px] mx-auto px-6 mb-16">
            <TextReveal className="font-serif text-4xl md:text-5xl">
              Our Core Values
            </TextReveal>
          </div>
          
          <div className="pl-6 md:pl-24">

            <motion.div style={{ x: `${position}%` }} className="flex gap-12 w-max">
              {VALUES.map((value, idx) => (
                <div
                  key={idx}
                  className="w-[85vw] md:w-[600px] flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 ease-luxury"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pt-8">
                    <h3 className="font-serif text-3xl mb-4 text-primary-200">
                      {value.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed font-light">
                      {value.description}
                    </p>
                    <div className="w-12 h-[1px] bg-primary-500 mt-8" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 flex items-center justify-center bg-white text-center">
          <div className="max-w-3xl">
            <p className="font-serif text-3xl md:text-5xl text-primary-950 leading-tight">
              "We don't just design clothes. We curate moments of confidence."
            </p>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
