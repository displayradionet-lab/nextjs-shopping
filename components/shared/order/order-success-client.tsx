'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useCartStore from '@/hooks/use-cart-store';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Check if user returned from successful Stripe payment
    const paymentSuccess = searchParams.get('payment') === 'success';
    
    if (paymentSuccess) {
      // Clear cart after successful payment
      clearCart();
    }
  }, [searchParams, clearCart]);

  return null; // This component doesn't render anything, just handles side effects
}
