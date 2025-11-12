
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
