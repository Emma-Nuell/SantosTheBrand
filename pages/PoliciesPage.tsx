import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Truck, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TABS = [
  { id: 'shipping', label: 'Shipping Policy', icon: Truck },
  { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw },
];

const SHIPPING_FAQS = [
  { q: "How long does shipping take?", a: "Domestic orders typically arrive within 3-5 business days. International shipping varies by location but generally takes 7-14 days." },
  { q: "Do you offer expedited shipping?", a: "Yes, we offer Next-Day Air and 2-Day delivery for an additional fee at checkout." },
  { q: "Where do you ship from?", a: "All Santos pieces are shipped from our atelier in New York City." },
];

const RETURNS_FAQS = [
  { q: "What is your return policy?", a: "We accept returns of unworn, unwashed items with original tags attached within 30 days of delivery." },
  { q: "How do I start a return?", a: "Visit our Returns Portal with your order number and email address to generate a prepaid shipping label." },
  { q: "Are sale items returnable?", a: "Final Sale items are not eligible for return. This will be clearly marked on the product page." },
];

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center py-6 text-left transition-colors ${isOpen ? 'text-primary-600' : 'text-slate-900 hover:text-primary-600'}`}
      >
        <span className="font-serif text-lg font-medium">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-6">
               <div className="bg-primary-50 p-6 rounded-sm border-l-2 border-primary-300">
                 <p className="text-slate-600 font-light leading-relaxed">{answer}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('shipping');

  return (
    <PageTransition>
      <div className="bg-white min-h-screen py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-primary-950 mb-4">Policies & Help</h1>
            <p className="text-slate-500">Everything you need to know about your Santos experience.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-4 flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-colors
                  ${activeTab === tab.id ? 'text-primary-950' : 'text-slate-400 hover:text-primary-600'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[400px]"
          >
            {activeTab === 'shipping' ? (
              <div>
                <div className="bg-primary-50 p-8 rounded-sm mb-8 flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-primary-600">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-950 mb-2">Free Global Shipping</h3>
                    <p className="text-slate-600 font-light text-sm">
                      We are pleased to offer complimentary shipping on all orders over $500. 
                      All shipments are insured and require a signature upon delivery to ensure your pieces arrive safely.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {SHIPPING_FAQS.map((faq, i) => (
                    <AccordionItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-primary-50 p-8 rounded-sm mb-8 flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-primary-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-950 mb-2">Hassle-Free Returns</h3>
                    <p className="text-slate-600 font-light text-sm">
                      We want you to love your purchase. If it's not perfect, you have 30 days to return it.
                      Restocking fees may apply for international returns.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {RETURNS_FAQS.map((faq, i) => (
                    <AccordionItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default PoliciesPage;