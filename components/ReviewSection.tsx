import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle, User as UserIcon } from 'lucide-react';
import { Review } from '../types';

interface ReviewSectionProps {
  reviews?: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl text-primary-950 mb-4">Client Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-2xl font-bold text-primary-900">{averageRating}</span>
              <span className="text-slate-500">({reviews.length} Verified Reviews)</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 px-8 py-3 bg-white border border-primary-200 text-primary-900 font-bold uppercase tracking-widest text-sm hover:border-primary-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-serif text-lg font-bold text-slate-900">{review.title}</h3>
                   <div className="flex text-yellow-500 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                   </div>
                 </div>
                 <span className="text-xs text-slate-400">{review.date}</span>
               </div>
               <p className="text-slate-600 mb-6 font-light leading-relaxed">"{review.text}"</p>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
                   <UserIcon className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-sm font-bold text-slate-900 block">{review.userName}</span>
                   {review.verified && (
                     <div className="flex items-center gap-1 text-xs text-green-600">
                       <CheckCircle className="w-3 h-3" /> Verified Buyer
                     </div>
                   )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg p-8 md:p-12 shadow-2xl rounded-sm z-10"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-slate-500" />
              </button>

              <h2 className="font-serif text-2xl font-bold text-primary-950 mb-2">Write a Review</h2>
              <p className="text-slate-500 mb-8 text-sm">Share your experience with this product.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star}
                        onMouseEnter={() => setNewReviewRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= newReviewRating ? 'text-yellow-500' : 'text-gray-200'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Review Title</label>
                   <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary-500 transition-colors" placeholder="Summarize your thoughts" />
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Review</label>
                   <textarea className="w-full border border-gray-200 p-3 h-32 outline-none focus:border-primary-500 transition-colors resize-none rounded-sm" placeholder="What did you like or dislike?" />
                </div>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-primary-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/20"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewSection;