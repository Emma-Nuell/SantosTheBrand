import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ShoppingBag, AlertTriangle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "@/hooks/orderHooks";

interface PaymentVerifyProps {
  clearCart: () => void;
}

const PaymentVerify: React.FC<PaymentVerifyProps> = ({ clearCart }) => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const { data, isLoading, isError } = useVerifyPayment(reference);

  const paymentStatus = data?.data?.paymentStatus;
  const orderNumber = data?.data?.orderNumber;
  const isSuccess = paymentStatus === "completed";

  // Clear cart on successful payment
  React.useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

  // No reference provided
  if (!reference) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 pt-28 lg:pt-36 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 sm:p-12 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="font-serif text-2xl text-primary-950 mb-2">
            No Payment Reference
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            We couldn't find a payment reference in the URL. If you just completed a payment,
            please check your email for a confirmation.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary-950 text-white px-8 py-3 font-medium rounded hover:bg-primary-900 transition-colors tracking-widest uppercase text-xs"
          >
            Return to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 pt-28 lg:pt-36 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 sm:p-12 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
          <h2 className="font-serif text-2xl text-primary-950 mb-2">
            Verifying Payment
          </h2>
          <p className="text-slate-500 text-sm">
            Please wait while we confirm your transaction...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 pt-28 lg:pt-36 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 sm:p-12 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="font-serif text-2xl text-primary-950 mb-2">
            Verification Failed
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            We couldn't verify your payment at this time. Don't worry — if your payment
            was successful, your order will be updated automatically.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="inline-block bg-primary-950 text-white px-8 py-3 font-medium rounded hover:bg-primary-900 transition-colors tracking-widest uppercase text-xs"
            >
              Return to Shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 pt-28 lg:pt-36 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white p-10 sm:p-12 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="font-serif text-3xl text-primary-950 mb-2">
            Payment Successful!
          </h2>
          <p className="text-slate-500 mb-2 text-sm leading-relaxed">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {orderNumber && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 mt-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Order Number
              </p>
              <p className="font-mono text-lg font-bold text-primary-950">
                {orderNumber}
              </p>
            </div>
          )}
          <p className="text-xs text-slate-400 mb-8">
            A confirmation email has been sent to you with your order details.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary-950 text-white px-8 py-3 font-medium rounded hover:bg-primary-900 transition-colors tracking-widest uppercase text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  // Failed / other status
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 pt-28 lg:pt-36 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 sm:p-12 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="font-serif text-2xl text-primary-950 mb-2">
          Payment {paymentStatus === "failed" ? "Failed" : "Not Completed"}
        </h2>
        {orderNumber && (
          <p className="text-xs text-slate-400 mb-2 font-mono">
            Order: {orderNumber}
          </p>
        )}
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Your payment could not be completed. No charges were made.
          Please try placing your order again.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="inline-block bg-[#10b981] text-white px-8 py-3 font-medium rounded hover:bg-[#059669] transition-colors tracking-widest uppercase text-xs shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="inline-block text-slate-500 hover:text-primary-950 px-8 py-2 font-medium transition-colors tracking-widest uppercase text-xs"
          >
            Return to Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerify;
