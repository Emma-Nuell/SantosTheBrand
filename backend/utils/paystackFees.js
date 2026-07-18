export const PAYSTACK_FEE_PERCENTAGE = 2; // 2%
export const PAYSTACK_FIXED_FEE = 100; // ₦100
export const PAYSTACK_FEE_CAP = 3000; // Max fee ₦3000

/**
 * Calculate total amount including Paystack fee.
 * Formula: (2% × baseAmount) + ₦100, capped at ₦3000
 * @param {number} baseAmount - The base amount before fees (subtotal + shipping - discount)
 * @returns {object} { baseAmount, paystackFee, totalAmount }
 */
export const calculateTotalAmount = (baseAmount) => {
  const calculatedFee =
    (PAYSTACK_FEE_PERCENTAGE / 100) * baseAmount + PAYSTACK_FIXED_FEE;
  
  // Approximate to highest 50 (e.g., 412 -> 450)
  let roundedFee = Math.ceil(calculatedFee / 50) * 50;
  
  const paystackFee = Math.min(roundedFee, PAYSTACK_FEE_CAP);
  return {
    baseAmount,
    paystackFee,
    totalAmount: Math.round(baseAmount + paystackFee),
  };
};
