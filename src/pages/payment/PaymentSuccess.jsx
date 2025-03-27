

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5); 

  useEffect(() => {
    // Force refresh of rentals on payment success
    const refreshRentals = async () => {
      try {
        await fetch('/api/payment/rentals', { credentials: 'include' });
      } catch (error) {
        console.error('Error refreshing rentals:', error);
      }
    };
    
    refreshRentals();
    
    // Redirect after countdown
    const timerId = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1);
      } else {
        handleImmediateRedirect();
      }
    }, 1000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timerId);
  }, [countdown, navigate]);

  // Navigate back to content
  const handleImmediateRedirect = () => {
    navigate('/browse');
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. You can now enjoy your rental.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to browse page in {countdown} seconds...
          </p>
          <button 
            onClick={handleImmediateRedirect} 
            className="mt-4 text-blue-600 hover:underline"
          >
            Redirect Now
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;