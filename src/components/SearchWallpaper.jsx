import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Stars, Heart, Music, Film, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const AnimatedMediaSearchWrapper = ({ children }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const decorElements = [
    { icon: Sparkles, x: 'left-8', y: 'top-8', size: 20, color: 'text-gray-500', animate: 'animate-pulse' },
    { icon: Heart, x: 'right-12', y: 'top-16', size: 20, color: 'text-gray-500', animate: 'animate-bounce' },
    { icon: Stars, x: 'left-16', y: 'bottom-20', size: 20, color: 'text-gray-500', animate: 'animate-pulse' },
    { icon: Music, x: 'right-10', y: 'bottom-12', size: 20, color: 'text-gray-500', animate: 'animate-bounce' },
    { icon: Film, x: 'left-20', y: 'top-20', size: 20, color: 'text-gray-500', animate: 'animate-spin' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 overflow-hidden flex items-center justify-center">
      <div className="absolute top-6 left-6 z-50">
        <Button 
          variant="default" 
          onClick={() => navigate('/')} 
          className="font-bold text-sm bg-gray-700 text-white hover:bg-gray-600 shadow-md border border-gray-600 px-4 py-2"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Button>
      </div>
      
      {decorElements.map((element, index) => {
        const IconComponent = element.icon;
        return (
          <div 
            key={`element-${index}`}
            className={`absolute ${element.x} ${element.y} ${element.animate} ${element.color} opacity-20 z-10`}
          >
            <IconComponent size={element.size} />
          </div>
        );
      })}
      
      <div className="relative z-20 w-full max-w-4xl p-8 bg-gray-900 shadow-lg rounded-lg border border-gray-700">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-t-lg"></div>
        <div className="relative z-30">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedMediaSearchWrapper;