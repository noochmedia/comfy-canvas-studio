
// Model Types
export interface Model {
  id: string;
  name: string;
  type: ModelType;
  preview?: string;
  description?: string;
  isFavorite?: boolean;
  lastUsed?: Date;
  tags?: string[];
}

export type ModelType = 'checkpoint' | 'lora' | 'embedding' | 'controlnet' | 'upscaler';

// Generation Types
export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  sampler: string;
  steps: number;
  cfgScale: number;
  width: number;
  height: number;
  seed: number | null;
  batchSize: number;
  batchCount: number;
}

export interface GenerationResult {
  id: string;
  images: string[];
  params: GenerationParams;
  createdAt: Date;
}

// UI State Types
export interface AppState {
  darkMode: boolean;
  generationType: GenerationType;
  isConnected: boolean;
  isGenerating: boolean;
  serverUrl: string;
  connectionError?: string;
}

export type GenerationType = 'text-to-image' | 'image-to-image' | 'inpainting' | 'text-to-video' | 'image-to-video';

// Settings and Config
export interface AppSettings {
  defaultGenerationParams: Partial<GenerationParams>;
  serverUrl: string;
  maxHistoryItems: number;
  autoSaveResults: boolean;
}
