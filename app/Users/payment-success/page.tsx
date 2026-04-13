"use client"
import { useEffect } from 'react';

export default function PaymentSuccess() {
  useEffect(() => {
    // Auto close the tab after 3 seconds
    const timer = setTimeout(() => {
      window.close();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">Your application has been submitted.</p>
        <p className="text-sm text-gray-400">This tab will close automatically...</p>
      </div>
    </div>
  );
}