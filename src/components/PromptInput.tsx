
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Sparkles, Wand2, Wand, AlertCircle } from 'lucide-react';

interface PromptInputProps {
  onPromptChange: (prompt: string) => void;
  onNegativePromptChange: (negativePrompt: string) => void;
  prompt: string;
  negativePrompt: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onPromptChange,
  onNegativePromptChange,
  prompt,
  negativePrompt,
  isGenerating,
  onGenerate
}) => {
  const [promptTab, setPromptTab] = useState<string>("prompt");
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(e.target.value);
  };
  
  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNegativePromptChange(e.target.value);
  };
  
  const tokenEstimate = Math.round(prompt.split(' ').length * 1.3);
  
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={promptTab} onValueChange={setPromptTab} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="negative">Negative Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="mt-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="prompt">Describe what you want to generate</Label>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>Est. tokens: {tokenEstimate}</span>
                  {tokenEstimate > 75 && (
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                  )}
                </div>
              </div>
              
              <Textarea
                id="prompt"
                placeholder="A beautiful landscape with mountains, forest, and a lake..."
                rows={5}
                value={prompt}
                onChange={handlePromptChange}
                className="resize-none focus-visible:ring-primary"
              />
              
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 items-center"
                >
                  <Wand className="h-3 w-3" />
                  <span>Enhance</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 items-center"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Stylize</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 items-center"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>Random</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="negative" className="mt-0">
            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Things to avoid in the generation</Label>
              <Textarea
                id="negative-prompt"
                placeholder="Low quality, blurry, distorted faces..."
                rows={5}
                value={negativePrompt}
                onChange={handleNegativePromptChange}
                className="resize-none focus-visible:ring-primary"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || !prompt.trim()} 
            className="w-full"
          >
            {isGenerating ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Generate</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptInput;
