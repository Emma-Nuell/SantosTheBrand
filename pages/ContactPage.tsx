import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Send, MapPin } from 'lucide-react';
import { FloatingInput } from '../components/AuthUI';
import PageTransition from '../components/PageTransition';
import TextReveal from '../components/TextReveal';

const ContactPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-20">
        
        {/* Map Section - Top on mobile, Left on Desktop */}
        <div className="flex flex-col-reverse lg:flex-row min-h-[calc(100vh-80px)]">
          
          {/* Map */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative bg-gray-200 overflow-hidden">
            {/* Styled Map Image (Grayscale) */}
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')" }} 
            />
            <div className="absolute inset-0 bg-primary-900/10" />
            
            {/* Interactive Pin */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center group cursor-pointer"
            >
              <div className="relative">
                 <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-xl shadow-primary-900/30 group-hover:scale-110 transition-transform">
                   <MapPin className="text-white w-6 h-6" />
                 </div>
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-600 rotate-45" />
                 {/* Ripple */}
                 <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping opacity-20" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 bg-white px-4 py-2 rounded-sm shadow-lg text-xs font-bold uppercase tracking-widest text-primary-950"
              >
                Santos Boutique
              </motion.div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-24">
            <div className="w-full max-w-md">
              <TextReveal className="font-serif text-4xl md:text-5xl text-primary-950 mb-4">Get in Touch</TextReveal>
              <p className="text-slate-500 mb-12 font-light">Questions about an order or want to book a styling appointment?</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="bg-primary-950 p-8 rounded-sm shadow-2xl">
                   <FloatingInput 
                     label="Name" 
                     value={formState.name} 
                     onChange={(e) => setFormState({...formState, name: e.target.value})}
                     className="bg-transparent"
                   />
                   <FloatingInput 
                     label="Email" 
                     value={formState.email} 
                     onChange={(e) => setFormState({...formState, email: e.target.value})}
                     className="bg-transparent"
                   />
                   <div className="relative mb-8">
                     <textarea 
                       className="w-full bg-white/5 border-b-2 border-white/20 focus:border-primary-500 outline-none text-white py-2 resize-none h-32 transition-colors placeholder:text-white/50"
                       placeholder="How can we help?"
                       value={formState.message}
                       onChange={(e) => setFormState({...formState, message: e.target.value})}
                     />
                   </div>

                   <button
                     type="submit"
                     disabled={isSending || isSent}
                     className={`w-full h-14 relative overflow-hidden rounded-sm font-bold uppercase tracking-widest text-sm transition-all duration-500
                       ${isSent ? 'bg-green-600 text-white' : 'bg-white text-primary-950 hover:bg-primary-100'}
                     `}
                   >
                     <AnimatePresence mode="wait">
                       {isSent ? (
                         <motion.div 
                           key="sent"
                           initial={{ opacity: 0, scale: 0.5 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="flex items-center justify-center gap-2"
                         >
                           <Check className="w-5 h-5" /> Message Sent
                         </motion.div>
                       ) : isSending ? (
                         <motion.div 
                           key="sending"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="flex items-center justify-center gap-2"
                         >
                           <div className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
                         </motion.div>
                       ) : (
                         <motion.div 
                           key="send"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center justify-center gap-2"
                         >
                           Send Message <Send className="w-4 h-4" />
                         </motion.div>
                       )}
                     </AnimatePresence>
                     
                     {/* Ripple Effect for success */}
                     {isSent && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-white rounded-full"
                        />
                     )}
                   </button>
                 </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactPage;