
export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

declare global {
  // Interface for AIStudio object on window
  interface AIStudio {
    openSelectKey: () => Promise<void>;
    hasSelectedApiKey: () => Promise<boolean>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
