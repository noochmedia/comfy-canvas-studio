
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, GenerationType, Model } from '@/types';
import { toast } from 'sonner';

interface AppContextType {
  state: AppState;
  setGenerationType: (type: GenerationType) => void;
  toggleDarkMode: () => void;
  setServerUrl: (url: string) => void;
  connectToServer: () => Promise<boolean>;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  recentModels: Model[];
  favoriteModels: Model[];
  addToRecentModels: (model: Model) => void;
  toggleFavoriteModel: (modelId: string) => void;
}

const initialState: AppState = {
  darkMode: true,
  generationType: 'text-to-image',
  isConnected: false,
  isGenerating: false,
  serverUrl: 'http://127.0.0.1:8188',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [recentModels, setRecentModels] = useState<Model[]>([]);
  const [favoriteModels, setFavoriteModels] = useState<Model[]>([]);

  // Initialize dark mode based on system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setState(prev => ({ ...prev, darkMode: isDark }));
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Try to connect to server on startup
  useEffect(() => {
    connectToServer();
  }, [state.serverUrl]);

  const toggleDarkMode = () => {
    setState(prev => {
      const newDarkMode = !prev.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, darkMode: newDarkMode };
    });
  };

  const setGenerationType = (generationType: GenerationType) => {
    setState(prev => ({ ...prev, generationType }));
  };

  const setServerUrl = (serverUrl: string) => {
    setState(prev => ({ ...prev, serverUrl }));
  };

  const connectToServer = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isConnected: false, connectionError: undefined }));
    
    try {
      // In a real app, we'd actually try to connect to the ComfyUI server
      // For this demo, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, isConnected: true }));
      toast.success('Connected to ComfyUI server');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        connectionError: errorMessage
      }));
      toast.error(`Connection failed: ${errorMessage}`);
      return false;
    }
  };

  const setIsGenerating = (isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGenerating }));
  };

  const addToRecentModels = (model: Model) => {
    setRecentModels(prev => {
      // Remove if already exists
      const filtered = prev.filter(m => m.id !== model.id);
      // Add to front of array
      return [model, ...filtered].slice(0, 10);
    });
  };

  const toggleFavoriteModel = (modelId: string) => {
    // Toggle in favorite models
    const existingIndex = favoriteModels.findIndex(m => m.id === modelId);
    
    if (existingIndex >= 0) {
      // Remove from favorites
      setFavoriteModels(prev => prev.filter(m => m.id !== modelId));
    } else {
      // Find in recent models and add to favorites
      const model = recentModels.find(m => m.id === modelId);
      if (model) {
        setFavoriteModels(prev => [...prev, {...model, isFavorite: true}]);
      }
    }
    
    // Update isFavorite flag in recent models
    setRecentModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? { ...model, isFavorite: !model.isFavorite } 
          : model
      )
    );
  };

  const value = {
    state,
    setGenerationType,
    toggleDarkMode,
    setServerUrl,
    connectToServer,
    isGenerating: state.isGenerating,
    setIsGenerating,
    recentModels,
    favoriteModels,
    addToRecentModels,
    toggleFavoriteModel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
