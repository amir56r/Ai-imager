
import React, { useState } from 'react';
import { MODELS, ASPECT_RATIOS } from '../constants';
import { generateImages } from '../services/geminiService';
import type { GeneratedImage } from '../types';
import ImageGrid from './ImageGrid';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    
    // Placeholder check for non-Gemini models
    if (selectedModel !== 'imagen-4.0-generate-001' && selectedModel !== 'gemini-2.5-flash-image') {
       setError(`Model "${MODELS.find(m => m.id === selectedModel)?.name}" is a placeholder and not implemented.`);
       return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setError(null);

    try {
      const images = await generateImages(prompt, selectedModel, 4, aspectRatio);
      setGeneratedImages(images);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-glow-purple/20 border border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 dark:text-white mb-2">
          Create with AI
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          Describe anything you can imagine. Let the AI bring it to life.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic cityscape at sunset, with flying cars and neon lights, hyperrealistic..."
            rows={3}
            className="flex-grow p-4 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-purple-500 focus:ring-purple-500 rounded-lg transition"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setAspectRatio(ratio.value)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                    aspectRatio === ratio.value
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full md:w-auto px-4 py-3 bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform transform duration-300"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </div>

      {error && <div className="mt-6 text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}

      <div className="w-full mt-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-4 text-slate-500 dark:text-slate-400">AI is thinking...</p>
          </div>
        ) : generatedImages.length > 0 ? (
          <ImageGrid images={generatedImages} />
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>Your generated images will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGenerator;
