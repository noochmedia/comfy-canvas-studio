
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PromptInput from './PromptInput';
import GenerationControls from './GenerationControls';
import OutputGallery from './OutputGallery';
import { GenerationParams, GenerationResult } from '@/types';
import { generateImages, mockModels } from '@/utils/api';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

const TextToImagePanel = () => {
  const { setIsGenerating } = useAppContext();
  const [prompt, setPrompt] = useState('A beautiful landscape with snow-capped mountains, a serene lake, and pine trees under a dramatic sky');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distortion, poorly drawn, ugly, bad anatomy');
  const [result, setResult] = useState<GenerationResult | null>(null);
  
  const [params, setParams] = useState<GenerationParams>({
    prompt: prompt,
    negativePrompt: negativePrompt,
    model: mockModels[0].id,
    sampler: 'euler_a',
    steps: 30,
    cfgScale: 7.0,
    width: 768,
    height: 768,
    seed: null,
    batchSize: 2,
    batchCount: 1,
  });
  
  const [isGenerating, setIsGeneratingLocal] = useState(false);
  
  const handleGenerate = async () => {
    try {
      setIsGeneratingLocal(true);
      setIsGenerating(true);
      
      // Update params with current prompt
      const currentParams = {
        ...params,
        prompt: prompt,
        negativePrompt: negativePrompt,
        // If seed is null, use random seed each time
        seed: params.seed === null ? Math.floor(Math.random() * 4294967295) : params.seed
      };
      
      // Generate images
      const result = await generateImages(currentParams);
      setResult(result);
      
      toast.success('Images generated successfully!');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate images');
    } finally {
      setIsGeneratingLocal(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
      <div className="md:col-span-5 space-y-4">
        <PromptInput 
          prompt={prompt}
          negativePrompt={negativePrompt}
          onPromptChange={setPrompt}
          onNegativePromptChange={setNegativePrompt}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
        
        <GenerationControls
          params={params}
          onParamsChange={setParams}
        />
      </div>
      
      <div className="md:col-span-7">
        {result ? (
          <OutputGallery result={result} />
        ) : (
          <Card className="h-full flex items-center justify-center p-8 border-dashed">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Generated Images Yet</h3>
              <p className="text-muted-foreground">
                Fill out the prompt and click 'Generate' to create images
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextToImagePanel;
