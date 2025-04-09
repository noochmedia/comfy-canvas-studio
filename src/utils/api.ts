
import { GenerationParams, GenerationResult, Model, ModelType } from '@/types';

// Mock model data
export const mockModels: Model[] = [
  {
    id: 'model1',
    name: 'Stable Diffusion XL',
    type: 'checkpoint' as ModelType,
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'State-of-the-art text to image model with enhanced detail and composition',
    isFavorite: true
  },
  {
    id: 'model2',
    name: 'Stable Diffusion 1.5',
    type: 'checkpoint' as ModelType,
    preview: 'https://images.unsplash.com/photo-1633168846771-8a00384e9def?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Reliable text to image model with good general capabilities',
    isFavorite: false
  },
  {
    id: 'model3',
    name: 'Dreamshaper',
    type: 'checkpoint' as ModelType,
    preview: 'https://images.unsplash.com/photo-1549244433-a82b2117f247?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Creative model focused on artistic and dreamlike imagery',
    isFavorite: false
  },
  {
    id: 'lora1',
    name: 'Realistic Vision',
    type: 'lora' as ModelType,
    preview: 'https://images.unsplash.com/photo-1603048588665-711bd5aec2d7?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'LoRA for enhancing photorealism in generated images',
    isFavorite: true
  },
  {
    id: 'lora2',
    name: 'AnimeFigure LoRA',
    type: 'lora' as ModelType,
    preview: 'https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Specialized in creating anime figure aesthetics',
    isFavorite: false
  }
];

// Mock sampler data
export const samplers = [
  { id: 'euler_a', name: 'Euler Ancestral', description: 'Good general-purpose sampler with a balance of speed and quality' },
  { id: 'dpm_2', name: 'DPM++ 2M Karras', description: 'High quality results with good details, slower than Euler' },
  { id: 'ddim', name: 'DDIM', description: 'Fast sampler, good for initial tests' },
  { id: 'dpm_sde', name: 'DPM++ SDE Karras', description: 'Excellent for detailed images, slower performance' },
  { id: 'lcm', name: 'LCM', description: 'Lightning fast, fewer steps, good for iteration' }
];

// Mock image generation - in a real app this would connect to ComfyUI
export async function generateImages(params: GenerationParams): Promise<GenerationResult> {
  console.log('Generating with params:', params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock response with unsplash images
  const mockImages = [
    'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1516146544193-b54a65682f16?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3'
  ].slice(0, params.batchSize);
  
  return {
    id: `gen-${Date.now()}`,
    images: mockImages,
    params,
    createdAt: new Date()
  };
}

// Server status check with actual connection to ComfyUI server
export async function checkServerStatus(url: string): Promise<boolean> {
  try {
    console.log(`Checking ComfyUI server status at: ${url}`);
    
    // Try to connect to the ComfyUI server
    // In a real implementation, this would:
    // 1. Make a GET request to serverUrl/system_stats
    // 2. Check if the response is valid
    
    // For demo, we're simulating a server check
    const response = await fetch(`${url}/system_stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Adding a cache busting parameter
      signal: AbortSignal.timeout(5000), // 5s timeout
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // Check if the response is valid JSON
    await response.json();
    
    return true;
  } catch (error) {
    console.error('Error checking server status:', error);
    // Re-throw with a more user-friendly message
    throw new Error(`Could not connect to ComfyUI server at ${url}`);
  }
}
