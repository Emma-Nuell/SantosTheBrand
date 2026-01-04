import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

// --- Types ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// --- Floating Label Input ---
export const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = "text", className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      if (props.onBlur) props.onBlur(e);
    };

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative mb-6">
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <input
              ref={ref}
              type={inputType}
              className={`peer w-full bg-white/5 border-b-2 placeholder-transparent focus:outline-none py-3 px-1 text-white transition-all duration-300
                ${error 
                  ? 'border-red-400' 
                  : isFocused 
                    ? 'border-primary-500 shadow-[0_4px_15px_-5px_rgba(168,85,247,0.5)]' 
                    : 'border-white/20 hover:border-white/40'
                } ${className}`}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              onChange={(e) => {
                setHasValue(!!e.target.value);
                if (props.onChange) props.onChange(e);
              }}
              {...props}
            />
            <label
              className={`absolute left-1 pointer-events-none transition-all duration-300 ease-luxury
                ${(isFocused || hasValue) 
                  ? '-top-5 text-xs text-primary-400 font-bold tracking-widest uppercase' 
                  : 'top-3 text-white/50 text-sm font-light'
                }`}
            >
              {label}
            </label>

            {/* Password Toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </motion.div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-5 left-0 flex items-center gap-1 text-xs text-red-400 font-medium"
            >
              <AlertCircle size={10} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// --- Primary Button ---
interface AuthButtonProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

export const AuthButton = ({ children, isLoading, onClick }: AuthButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    disabled={isLoading}
    onClick={onClick}
    className="w-full bg-primary-600 text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-primary-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {isLoading ? <Loader2 className="animate-spin" /> : children}
  </motion.button>
);