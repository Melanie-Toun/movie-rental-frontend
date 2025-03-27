
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verifyPayment = async () => {
      const status = searchParams.get('status');
      const txRef = searchParams.get('tx_ref');
      const transactionId = searchParams.get('transaction_id');

      if (!txRef) {
        console.log('No transaction reference found, redirecting to browse');
        navigate('/browse');
        return;
      }

      try {
        console.log('Verifying payment:', { status, txRef, transactionId });
        
        const response = await fetch(`/api/payment/verifyFlw?transaction_id=${transactionId}&tx_ref=${txRef}&status=${status}`);
        const data = await response.json();

        if (data.success) {
          console.log('Payment verification successful:', data);
          
          // Clear the pending payment data
          localStorage.removeItem('pendingPayment');
          
          // Redirect to success page
          navigate('/payment/success');
        } else {
          console.error('Payment verification failed:', data);
          navigate('/browse');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        navigate('/browse');
      } finally {
        setIsVerifying(false);
      }
    };

    // If we have URL parameters, attempt to verify the payment
    if (searchParams.has('status')) {
      verifyPayment();
    } else {
      setIsVerifying(false);
      navigate('/browse');
    }
  }, [searchParams, navigate]);

  // Show loading indicator while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentVerification;