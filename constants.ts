
export const NAV_LINKS = [
  { name: 'Generator', page: 'generator' },
  { name: 'Gallery', page: 'gallery' },
  { name: 'Models', page: 'models' },
  { name: 'About', page: 'about' },
];

export const MODELS = [
  { id: 'gemini-2.5-flash-image', name: 'Gemini Flash Image (Fast)' },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini Pro Image (High Quality)' },
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4' },
];

export const ASPECT_RATIOS: { value: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'; label: string }[] = [
  { value: '1:1', label: '1:1' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

export const IMAGE_SIZES = [
  { value: '1K', label: '1K (Standard)' },
  { value: '2K', label: '2K (HD)' },
  { value: '4K', label: '4K (Ultra HD)' },
];
