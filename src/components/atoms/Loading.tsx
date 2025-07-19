'use client';

import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = true,
  className = ""
}) => {
  if (fullScreen) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Spinner size="md" variant="primary" />
    </div>
  );
};

export default Loading;