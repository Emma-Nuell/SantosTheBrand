import React, { useState } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
}

const steps = ["Shipping", "Payment", "Review"];

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
        clearCart();
      }, 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-primary-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-2xl shadow-xl max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl text-primary-900 mb-2">Order Confirmed</h2>
          <p className="text-slate-500 mb-8">Thank you for your purchase. A confirmation email has been sent to you.</p>
          <Link to="/" className="inline-block bg-primary-900 text-white px-8 py-3 font-medium rounded hover:bg-primary-800 transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="font-serif text-2xl mb-4">Your bag is empty</h2>
            <Link to="/shop" className="text-primary-600 underline">Start Shopping</Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-primary-900 mb-8 text-center">Checkout</h1>
        
        {/* Progress */}
        <div className="flex justify-center mb-12">
           <div className="flex items-center">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx <= currentStep ? 'bg-primary-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {idx + 1}
                  </div>
                  <span className={`ml-2 text-sm ${idx <= currentStep ? 'text-primary-900 font-medium' : 'text-gray-500'}`}>{step}</span>
                  {idx < steps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-4" />}
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                    <input type="text" placeholder="Last Name" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                  </div>
                  <input type="text" placeholder="Address" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full col-span-1" />
                    <input type="text" placeholder="State" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full col-span-1" />
                    <input type="text" placeholder="ZIP" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full col-span-1" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Details</h2>
                  <div className="p-4 border border-primary-100 bg-primary-50 rounded flex items-center gap-4 mb-4">
                    <div className="w-4 h-4 bg-primary-600 rounded-full" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <input type="text" placeholder="Card Number" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                    <input type="text" placeholder="CVC" className="p-3 border rounded focus:ring-1 focus:ring-primary-500 w-full" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold mb-4">Review Order</h2>
                  <div className="bg-gray-50 p-4 rounded text-sm text-slate-600">
                    <p className="font-bold text-slate-900 mb-1">Ship to:</p>
                    <p>Jane Doe</p>
                    <p>123 Luxury Lane, Amethyst City</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cart.map((item, i) => (
                      <div key={`${item.id}-${i}`} className="py-4 flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                        <div>
                          <p className="font-serif font-medium">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.selectedColor} / {item.selectedSize}</p>
                          <p className="text-sm font-medium mt-1">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                 <button 
                   onClick={handleNext}
                   disabled={isProcessing}
                   className="bg-primary-900 text-white px-8 py-3 font-medium uppercase tracking-widest hover:bg-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   {isProcessing ? 'Processing...' : currentStep === 2 ? 'Place Order' : 'Next Step'}
                 </button>
              </div>
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                <h3 className="font-serif text-lg font-bold mb-6">Order Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                   <div className="flex justify-between text-slate-600">
                     <span>Subtotal</span>
                     <span>${subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-slate-600">
                     <span>Shipping</span>
                     <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                   </div>
                   <div className="flex justify-between text-primary-900 font-bold text-lg pt-4 border-t border-gray-100">
                     <span>Total</span>
                     <span>${total.toLocaleString()}</span>
                   </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-gray-50 p-3 rounded">
                   <Truck className="w-4 h-4" />
                   Estimated Delivery: 2-3 Business Days
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;