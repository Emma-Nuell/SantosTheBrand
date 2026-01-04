import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Info } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

// Mock measurement standards (in inches)
const STANDARDS: Record<string, { chest: number; waist: number; hips: number }> = {
  XS: { chest: 32, waist: 24, hips: 34 },
  S:  { chest: 34, waist: 26, hips: 36 },
  M:  { chest: 36, waist: 28, hips: 38 },
  L:  { chest: 39, waist: 31, hips: 41 },
  XL: { chest: 42, waist: 34, hips: 44 },
};

const DynamicFitGuide = () => {
  const [measurements, setMeasurements] = useState({ chest: 34, waist: 26, hips: 36 });
  const [selectedSize, setSelectedSize] = useState('S');
  const [fitStatus, setFitStatus] = useState<'Tight' | 'Perfect' | 'Oversized'>('Perfect');

  useEffect(() => {
    const standard = STANDARDS[selectedSize];
    const diffChest = standard.chest - measurements.chest;
    const diffWaist = standard.waist - measurements.waist;
    
    // Simple algorithm to determine fit feeling
    const totalDiff = diffChest + diffWaist;

    if (totalDiff < -2) {
      setFitStatus('Tight');
    } else if (totalDiff > 3) {
      setFitStatus('Oversized');
    } else {
      setFitStatus('Perfect');
    }
  }, [measurements, selectedSize]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setMeasurements(prev => ({ ...prev, [e.target.name]: val }));
  };

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm my-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
          <Ruler className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary-950">The Perfect Fit</h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Find your size</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {['Chest', 'Waist', 'Hips'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{field} (in)</label>
                <input
                  type="number"
                  name={field.toLowerCase()}
                  value={measurements[field.toLowerCase() as keyof typeof measurements]}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-200 py-2 text-lg font-serif text-primary-950 outline-none focus:border-primary-500 transition-colors bg-transparent"
                />
              </div>
            ))}
          </div>
          
          <div className="pt-4">
             <p className="text-xs text-slate-400 mb-4 uppercase tracking-widest">Select a size to simulate:</p>
             <div className="flex justify-between relative">
               {/* Track Line */}
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 -z-10" />
               
               {SIZES.map((size) => (
                 <button
                   key={size}
                   onClick={() => setSelectedSize(size)}
                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                     ${selectedSize === size 
                       ? 'bg-primary-950 text-white scale-110 shadow-lg' 
                       : 'bg-white border border-gray-200 text-slate-400 hover:border-primary-300'}
                   `}
                 >
                   {size}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-sm p-6 relative overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div
               key={fitStatus + selectedSize}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4 }}
               className="text-center z-10"
             >
               <h4 className="font-serif text-3xl text-primary-950 mb-2">{fitStatus} Fit</h4>
               <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                 {fitStatus === 'Tight' && "This size will fit closely to the body. Consider sizing up for comfort."}
                 {fitStatus === 'Perfect' && "This size aligns with your measurements for our intended silhouette."}
                 {fitStatus === 'Oversized' && "This size offers a relaxed, draped look."}
               </p>
             </motion.div>
           </AnimatePresence>

           {/* Abstract Garment Overlay Animation */}
           <motion.div 
             animate={{
               width: fitStatus === 'Tight' ? '90%' : fitStatus === 'Oversized' ? '110%' : '100%',
               borderColor: fitStatus === 'Perfect' ? '#a855f7' : fitStatus === 'Tight' ? '#ef4444' : '#94a3b8' // Purple, Red, Gray
             }}
             className="absolute inset-0 m-auto border-[1px] border-dashed rounded-full opacity-20 w-3/4 h-3/4 pointer-events-none transition-colors duration-500"
           />
        </div>
      </div>
    </div>
  );
};

export default DynamicFitGuide;