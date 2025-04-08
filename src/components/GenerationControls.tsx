
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerationParams } from '@/types';
import { samplers } from '@/utils/api';
import { InfoIcon, Dices, Lock, Unlock } from 'lucide-react';

interface GenerationControlsProps {
  params: GenerationParams;
  onParamsChange: (params: GenerationParams) => void;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({ params, onParamsChange }) => {
  // Helper to update just one param
  const updateParam = <K extends keyof GenerationParams>(
    key: K,
    value: GenerationParams[K]
  ) => {
    onParamsChange({ ...params, [key]: value });
  };
  
  // Generate a random seed
  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 4294967295);
    updateParam('seed', newSeed);
  };
  
  // Lock/unlock seed
  const toggleSeedLock = () => {
    updateParam('seed', params.seed === null ? Math.floor(Math.random() * 4294967295) : null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Generation Settings</CardTitle>
        <CardDescription>Adjust parameters to control the output</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="sampler">Sampler</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>Different samplers produce different results and take varying amounts of time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Select
            value={params.sampler}
            onValueChange={(value) => updateParam('sampler', value)}
          >
            <SelectTrigger id="sampler">
              <SelectValue placeholder="Select a sampler" />
            </SelectTrigger>
            <SelectContent>
              {samplers.map((sampler) => (
                <SelectItem key={sampler.id} value={sampler.id}>
                  {sampler.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="width">Width</Label>
              </div>
              <Select
                value={String(params.width)}
                onValueChange={(value) => updateParam('width', Number(value))}
              >
                <SelectTrigger id="width">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="768">768px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1280">1280px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="height">Height</Label>
              </div>
              <Select
                value={String(params.height)}
                onValueChange={(value) => updateParam('height', Number(value))}
              >
                <SelectTrigger id="height">
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="768">768px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1280">1280px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="steps-slider">Steps: {params.steps}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More steps generally produces better quality but takes longer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Slider
              id="steps-slider"
              min={10}
              max={50}
              step={1}
              value={[params.steps]}
              onValueChange={([value]) => updateParam('steps', value)}
              className="py-2"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="cfg-slider">CFG Scale: {params.cfgScale.toFixed(1)}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Controls how closely the image follows the prompt. Higher values = more prompt adherence.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Slider
              id="cfg-slider"
              min={1}
              max={20}
              step={0.1}
              value={[params.cfgScale]}
              onValueChange={([value]) => updateParam('cfgScale', value)}
              className="py-2"
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="seed-input">Seed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="seed-input"
                  type="number"
                  value={params.seed === null ? 'random' : params.seed}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      updateParam('seed', value);
                    }
                  }}
                  disabled={params.seed === null}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSeedLock}
                  title={params.seed === null ? "Lock seed" : "Unlock seed (use random)"}
                >
                  {params.seed === null ? (
                    <Unlock className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateRandomSeed}
                  disabled={params.seed === null}
                  title="Generate random seed"
                >
                  <Dices className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="batch-size">Batch Size</Label>
              <Select
                value={String(params.batchSize)}
                onValueChange={(value) => updateParam('batchSize', Number(value))}
              >
                <SelectTrigger id="batch-size">
                  <SelectValue placeholder="Batch Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="batch-count">Batch Count</Label>
              <Select
                value={String(params.batchCount)}
                onValueChange={(value) => updateParam('batchCount', Number(value))}
              >
                <SelectTrigger id="batch-count">
                  <SelectValue placeholder="Batch Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationControls;
