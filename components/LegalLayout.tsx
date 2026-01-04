import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import PageTransition from './PageTransition';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <h1 className="font-serif text-4xl md:text-6xl text-primary-950 mb-6">{title}</h1>
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Last Updated: {lastUpdated}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-32">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Table of Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`group w-full flex items-center justify-between py-3 px-4 text-sm text-left transition-colors border-l-2
                        ${activeSection === section.id 
                          ? 'border-primary-600 text-primary-950 font-medium bg-primary-50' 
                          : 'border-transparent text-slate-500 hover:text-primary-600 hover:border-primary-200'}
                      `}
                    >
                      {section.title}
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-3/4">
              <div className="prose prose-slate max-w-none">
                {sections.map((section) => (
                  <motion.div 
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-16 scroll-mt-32"
                  >
                    <h2 className="font-serif text-2xl text-primary-950 mb-6">{section.title}</h2>
                    <div className="text-slate-600 font-light leading-relaxed space-y-4">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default LegalLayout;