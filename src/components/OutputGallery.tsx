
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GenerationResult } from '@/types';
import { Download, Expand, Info, Share2, Star } from 'lucide-react';

interface OutputGalleryProps {
  result: GenerationResult | null;
}

const OutputGallery: React.FC<OutputGalleryProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Results</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Info className="mr-1 h-3 w-3" />
              Details
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-3 w-3" />
              Save All
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.images.map((image, index) => (
              <ImageCard key={index} src={image} index={index} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface ImageCardProps {
  src: string;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, index }) => {
  return (
    <div className="rounded-md overflow-hidden border border-border bg-card relative group">
      <div className="aspect-square overflow-hidden">
        <img src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Expand className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Star className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Image {index + 1}
      </div>
    </div>
  );
};

export default OutputGallery;
