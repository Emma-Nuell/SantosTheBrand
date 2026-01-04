import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { JOURNAL_ENTRIES } from '../constants';

const JournalPage = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-primary-950 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-medium mb-6"
          >
            The Santos Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-200 text-lg md:text-xl font-light max-w-2xl mx-auto"
          >
            Curated stories on style, craftsmanship, and the art of modern luxury.
          </motion.p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {JOURNAL_ENTRIES.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-8">
                <img 
                  src={entry.image} 
                  alt={entry.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span className="text-primary-600">{entry.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>{entry.date}</span>
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl text-primary-950 mb-3 leading-tight group-hover:text-primary-700 transition-colors">
                  {entry.title}
                </h2>
                
                <p className="text-slate-600 font-light text-lg mb-6 line-clamp-2">
                  {entry.subtitle}
                </p>

                <div className="relative inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-950 group-hover:text-primary-700 transition-colors">
                  Read Article <ArrowUpRight className="w-4 h-4" />
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary-200 origin-left transform scale-x-0 transition-transform duration-500 ease-luxury group-hover:scale-x-100 group-hover:bg-primary-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;