
export const NAV_LINKS = [
  { name: 'Generator', page: 'generator' },
  { name: 'Gallery', page: 'gallery' },
  { name: 'Models', page: 'models' },
  { name: 'About', page: 'about' },
];

export const MODELS = [
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini Flash Image' },
  { id: 'stable-diffusion-placeholder', name: 'Stable Diffusion (Placeholder)' },
  { id: 'dall-e-placeholder', name: 'DALL·E (Placeholder)' },
];

export const ASPECT_RATIOS: { value: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '4:3', label: 'Photo (4:3)' },
  { value: '3:4', label: 'Tall (3:4)' },
];
