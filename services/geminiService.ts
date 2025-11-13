
import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

// Helper to check if the environment supports dynamic key selection
export const supportsApiKeySelection = (): boolean => {
  return typeof window !== 'undefined' && !!window.aistudio;
};

// Helper to trigger the key selection dialog
export const selectApiKey = async () => {
  if (window.aistudio) {
    await window.aistudio.openSelectKey();
  }
};

export const generateImages = async (
  prompt: string,
  model: string,
  numberOfImages: number,
  aspectRatio: AspectRatio
): Promise<GeneratedImage[]> => {
  // Ensure we have a key. If in AI Studio, this might prompt or rely on previous selection.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // If we are in an environment that supports selection but haven't selected one, we can't proceed without user action.
    // The UI should handle this by calling selectApiKey() if supportsApiKeySelection() is true.
    throw new Error("API_KEY_MISSING"); 
  }
  
  // Always create a new instance to ensure we pick up the latest key if it changed
  const ai = new GoogleGenAI({ apiKey });

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
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_MISSING')) {
             throw new Error('API_KEY_INVALID');
        }
    }
    throw new Error('Failed to generate images. The AI service may be busy or unavailable.');
  }
};

export const editImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImage[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const images: GeneratedImage[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
           images.push({
             id: `edit-${Date.now()}-${images.length}`,
             src: `data:image/png;base64,${part.inlineData.data}`,
             prompt: prompt,
             model: 'gemini-2.5-flash-image'
           });
        }
      }
    }

    if (images.length === 0) {
      throw new Error("No image was returned by the model.");
    }
    
    return images;

  } catch (error) {
    console.error('Error editing image:', error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_MISSING')) {
             throw new Error('API_KEY_INVALID');
        }
    }
    throw new Error('Failed to edit image. ' + (error instanceof Error ? error.message : ''));
  }
};
