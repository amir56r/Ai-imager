
import { GoogleGenAI } from "@google/genai";
import type { GeneratedImage } from '../types';

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export const generateImages = async (
  prompt: string,
  model: string,
  numberOfImages: number,
  aspectRatio: AspectRatio
): Promise<GeneratedImage[]> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    throw new Error("API key not found. Please ensure it is configured correctly.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001', // Using the high-quality model for best results
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    return response.generatedImages.map((img, index) => ({
      id: `${Date.now()}-${index}`,
      src: `data:image/png;base64,${img.image.imageBytes}`,
      prompt: prompt,
      model: model,
    }));

  } catch (error) {
    console.error('Error generating images with Gemini API:', error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The provided API key is invalid. Please check your configuration.');
    }
    throw new Error('Failed to generate images. The AI service may be busy or unavailable.');
  }
};
