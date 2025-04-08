
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import TextToImagePanel from '@/components/TextToImagePanel';
import MainLayout from '@/layouts/MainLayout';

const Index = () => {
  return (
    <AppProvider>
      <div className="h-full">
        <TextToImagePanel />
      </div>
    </AppProvider>
  );
};

export default Index;
