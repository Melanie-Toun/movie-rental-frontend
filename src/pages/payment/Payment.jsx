import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const media = location.state?.media;
  const [discountStatus, setDiscountStatus] = useState({
    isDiscount: false,
    rentalCount: 0,
    nextDiscountAt: null,
    loading: true
  });

  useEffect(() => {
    if (!media) {
      navigate('/browse');
    }
  }, [media, navigate]);

  useEffect(() => {
    // Fetch discount status when component mounts
    const fetchDiscountStatus = async () => {
      try {
        const response = await fetch('/api/payment/discount-status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch discount status');
        }

        const data = await response.json();
        if (data.success) {
          setDiscountStatus({
            isDiscount: data.isDiscount,
            rentalCount: data.rentalCount,
            nextDiscountAt: data.nextDiscountAt,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching discount status:', error);
        setDiscountStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDiscountStatus();
  }, []);

  // Return early if no media, but after the useEffect is defined
  if (!media) {
    return null;
  }

  const handlePayment = async () => {
    try {
      console.log('Initiating payment with data:', {
        userId: user.id,
        mediaType: media.numberOfSeasons ? 'tvshow' : 'movie',
        mediaId: media.id,
        email: user.email,
        phone: user.phone || '',
      });
  
      const response = await fetch('/api/payment/flw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          mediaType: media.numberOfSeasons ? 'tvshow' : 'movie',
          mediaId: media.id,
          email: user.email,
          phone: user.phone || '00000000000', // Provide a default phone number if not available
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment error response:', errorData);
        throw new Error(errorData.message || 'Failed to initiate payment');
      }
  
      const data = await response.json();
  
      if (data.success && data.data.link) {
        localStorage.setItem('pendingPayment', JSON.stringify({
          paymentId: data.data.paymentId,
          reference: data.data.reference,
          discountApplied: data.data.discountApplied
        }));
        
        window.location.href = data.data.link;
      } else {
        console.error('Failed to initiate payment:', data);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '₦0.00';
    return `₦${Number(price).toFixed(2)}`;
  };

  const calculateDiscountedPrice = (price) => {
    if (discountStatus.isDiscount) {
      return price * 0.9; // 10% discount
    }
    return price;
  };

  const handleGoBack = () => {
    navigate('/browse');
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <Button
          onClick={handleGoBack}
          className="m-4"
        >
            Back
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Rental</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Media Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Media Details</h3>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={media.posterPath}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">{media.title}</h4>
                <p className="text-sm text-gray-500">{media.overview}</p>
                {discountStatus.isDiscount ? (
                  <div className="flex flex-col">
                    <p className="text-lg line-through text-gray-500">{formatPrice(media.rentPrice)}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-green-600">{formatPrice(calculateDiscountedPrice(media.rentPrice))}</p>
                      <Badge className="bg-green-100 text-green-800">10% Discount Applied</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-bold">{formatPrice(media.rentPrice)}</p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Username:</span> {user.username}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p>
                  <span className="font-semibold">Amount:</span> {discountStatus.isDiscount 
                    ? formatPrice(calculateDiscountedPrice(media.rentPrice))
                    : formatPrice(media.rentPrice)
                  }
                </p>
                
                {!discountStatus.loading && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <h4 className="font-semibold mb-1">Discount Status</h4>
                    {discountStatus.isDiscount ? (
                      <p className="text-green-600">You have a 10% loyalty discount on all rentals!</p>
                    ) : (
                      <p>Rent {discountStatus.nextDiscountAt} more {discountStatus.nextDiscountAt === 1 ? 'title' : 'titles'} to unlock a 10% loyalty discount.</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Rental count: {discountStatus.rentalCount}</p>
                  </div>
                )}
              </div>
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handlePayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;