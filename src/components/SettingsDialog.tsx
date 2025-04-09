
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Loader2 } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { state, setServerUrl, connectToServer } = useAppContext();
  const [serverUrlInput, setServerUrlInput] = useState(state.serverUrl);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSave = async () => {
    setServerUrlInput(serverUrlInput.trim());
    
    if (serverUrlInput !== state.serverUrl) {
      setServerUrl(serverUrlInput);
    }
    
    setIsConnecting(true);
    try {
      await connectToServer();
    } finally {
      setIsConnecting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your ComfyUI connection and application preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="server-url">ComfyUI Server URL</Label>
            <div className="flex gap-2">
              <Input
                id="server-url"
                value={serverUrlInput}
                onChange={(e) => setServerUrlInput(e.target.value)}
                placeholder="e.g., http://127.0.0.1:8188"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={async () => {
                  setIsConnecting(true);
                  try {
                    await connectToServer();
                  } finally {
                    setIsConnecting(false);
                  }
                }}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the URL of your ComfyUI server. This can be a local server or a cloud-based instance.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className={`w-2 h-2 rounded-full ${state.isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className="text-xs text-muted-foreground">
                {state.isConnected ? 'Connected' : 'Disconnected'} 
                {state.connectionError && ` - ${state.connectionError}`}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
