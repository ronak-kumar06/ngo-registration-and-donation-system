'use client';

import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Script
        id="payhere-js"
        src="https://www.payhere.lk/lib/payhere.js"
      />
      {children}
    </AuthProvider>
  );
}
