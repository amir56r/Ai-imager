
import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ImageSize = '1K' | '2K' | '4K';

export const generateImages = async (
  prompt: string,
  model: string,
  numberOfImages: number,
  aspectRatio: AspectRatio,
  imageSize: ImageSize = '1K'
): Promise<GeneratedImage[]> => {
  // Always create a new instance right before calling to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    // Handle Imagen 4
    if (model === 'imagen-4.0-generate-001') {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
      });

      return response.generatedImages.map((img, index) => ({
        id: `img-${Date.now()}-${index}`,
        src: `data:image/png;base64,${img.image.imageBytes}`,
        prompt: prompt,
        model: 'Imagen 4',
      }));
    }
    
    // Handle Gemini 3 Pro Image (High Quality)
    if (model === 'gemini-3-pro-image-preview') {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        },
      });

      const images: GeneratedImage[] = [];
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData) {
          images.push({
            id: `pro-${Date.now()}-${images.length}`,
            src: `data:image/png;base64,${part.inlineData.data}`,
            prompt: prompt,
            model: 'Gemini Pro Image'
          });
        }
      }
      return images;
    }

    // Default: Gemini 2.5 Flash Image (Fast)
    if (model === 'gemini-2.5-flash-image') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          // Note: responseModalities should be used when you expect specific output types
          // but for basic image generation with flash-image, generateContent works well.
        },
      });

      const images: GeneratedImage[] = [];
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData) {
          images.push({
            id: `flash-${Date.now()}-${images.length}`,
            src: `data:image/png;base64,${part.inlineData.data}`,
            prompt: prompt,
            model: 'Gemini Flash Image'
          });
        }
      }
      return images;
    }

    throw new Error(`Unsupported model: ${model}`);

  } catch (error: any) {
    console.error('Generation error:', error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};

export const editImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImage[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
    });

    const images: GeneratedImage[] = [];
    const parts = response.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData) {
         images.push({
           id: `edit-${Date.now()}-${images.length}`,
           src: `data:image/png;base64,${part.inlineData.data}`,
           prompt: prompt,
           model: 'Gemini Flash Edit'
         });
      }
    }
    return images;
  } catch (error: any) {
    console.error('Edit error:', error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};
