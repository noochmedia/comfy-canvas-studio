
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "sonner";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useAppContext } from '@/context/AppContext';

const MainLayout = () => {
  const { state } = useAppContext();
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
      
      {/* Toaster for notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default MainLayout;
