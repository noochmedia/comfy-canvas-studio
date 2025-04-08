
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { Model, ModelType } from '@/types';
import { Search, Heart, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockModels } from '@/utils/api';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { favoriteModels, recentModels, addToRecentModels, toggleFavoriteModel } = useAppContext();
  
  // Filter models based on search term
  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const modelTypes: { value: ModelType; label: string; icon: React.ReactNode }[] = [
    { value: 'checkpoint', label: 'Base Models', icon: <Star className="h-4 w-4" /> },
    { value: 'lora', label: 'LoRAs', icon: <Star className="h-4 w-4" /> },
    { value: 'embedding', label: 'Embeddings', icon: <Star className="h-4 w-4" /> },
    { value: 'controlnet', label: 'ControlNet', icon: <Star className="h-4 w-4" /> },
    { value: 'upscaler', label: 'Upscalers', icon: <Star className="h-4 w-4" /> },
  ];
  
  // Handle model selection
  const handleSelectModel = (model: Model) => {
    addToRecentModels(model);
  };
  
  if (collapsed) {
    return (
      <div className="h-full w-12 bg-sidebar border-r border-border flex flex-col items-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(false)}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col gap-4 items-center">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-72 bg-sidebar text-sidebar-foreground border-r border-border flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Models</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(true)}
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search models..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">Favorites</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 px-2">
          <ScrollArea className="h-full">
            {modelTypes.map((type) => (
              <div key={type.value} className="mb-6">
                <div className="flex items-center gap-2 px-2 mb-2">
                  {type.icon}
                  <h3 className="text-sm font-medium">{type.label}</h3>
                </div>
                
                <div className="space-y-2">
                  {filteredModels
                    .filter(model => model.type === type.value)
                    .map((model) => (
                      <ModelCard 
                        key={model.id} 
                        model={model} 
                        onSelect={() => handleSelectModel(model)}
                        onToggleFavorite={() => toggleFavoriteModel(model.id)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="favorites" className="flex-1 px-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {favoriteModels.length > 0 ? (
                favoriteModels.map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    onSelect={() => handleSelectModel(model)}
                    onToggleFavorite={() => toggleFavoriteModel(model.id)}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No favorite models yet</p>
                  <p className="text-sm">Click the heart icon on any model to add it to your favorites</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="recent" className="flex-1 px-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {recentModels.length > 0 ? (
                recentModels.map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    onSelect={() => handleSelectModel(model)}
                    onToggleFavorite={() => toggleFavoriteModel(model.id)}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No recently used models</p>
                  <p className="text-sm">Models you use will appear here</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ModelCardProps {
  model: Model;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const ModelCard = ({ model, onSelect, onToggleFavorite }: ModelCardProps) => {
  return (
    <div 
      className="p-2 rounded-md hover:bg-sidebar-accent/40 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        {model.preview ? (
          <div 
            className="w-10 h-10 rounded bg-cover bg-center" 
            style={{ backgroundImage: `url(${model.preview})` }}
          />
        ) : (
          <div className="w-10 h-10 rounded bg-sidebar-accent flex items-center justify-center">
            <Star className="h-4 w-4" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{model.name}</p>
          <p className="text-xs text-muted-foreground truncate">{model.type}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Heart className={`h-4 w-4 ${model.isFavorite ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
