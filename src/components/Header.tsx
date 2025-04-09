
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from '@/context/AppContext';
import { GenerationType } from '@/types';
import { Moon, Sun, Settings, RefreshCcw } from 'lucide-react';
import SettingsDialog from './SettingsDialog';

const Header = () => {
  const { state, setGenerationType, toggleDarkMode, connectToServer } = useAppContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const generationTypes: { value: GenerationType; label: string }[] = [
    { value: 'text-to-image', label: 'Text to Image' },
    { value: 'image-to-image', label: 'Image to Image' },
    { value: 'inpainting', label: 'Inpainting' },
    { value: 'text-to-video', label: 'Text to Video' },
    { value: 'image-to-video', label: 'Image to Video' },
  ];
  
  const handleTabChange = (value: string) => {
    setGenerationType(value as GenerationType);
  };
  
  return (
    <header className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Comfy Canvas Studio</h1>
          
          <div className="flex items-center gap-2 ml-6">
            <div 
              className={`w-3 h-3 rounded-full ${state.isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
            />
            <span className="text-sm text-muted-foreground">
              {state.isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {!state.isConnected && (
              <Button variant="ghost" size="icon" onClick={connectToServer} title="Reconnect">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            title={state.darkMode ? 'Light mode' : 'Dark mode'}
          >
            {state.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            title="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <Tabs 
          value={state.generationType} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start">
            {generationTypes.map((type) => (
              <TabsTrigger 
                key={type.value} 
                value={type.value} 
                className="flex-1 max-w-[200px]"
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default Header;
