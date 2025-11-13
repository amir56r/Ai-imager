import React, { useState, useRef, useEffect } from 'react';
import { MODELS, ASPECT_RATIOS } from '../constants';
import { generateImages, editImage } from '../services/geminiService';
import type { GeneratedImage } from '../types';
import ImageGrid from './ImageGrid';
import Spinner from './Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { CameraIcon } from './icons/CameraIcon';

type Mode = 'generate' | 'edit';

const QUICK_EDITS = [
  { label: 'Cyberpunk', prompt: 'Apply a futuristic cyberpunk style with neon lights' },
  { label: 'Sketch', prompt: 'Turn this image into a charcoal sketch' },
  { label: 'Watercolor', prompt: 'Convert to a watercolor painting' },
  { label: 'Anime', prompt: 'Transform into an anime style illustration' },
  { label: 'Remove Background', prompt: 'Remove the background from the image' },
];

const ImageGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageMime, setUploadedImageMime] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG).');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      setUploadedImageMime(file.type);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please allow permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedImage(dataUrl);
        setUploadedImageMime('image/jpeg');
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageMime('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyQuickEdit = (editPrompt: string) => {
    setPrompt(editPrompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    // Keep previous images visible while loading new ones in a real app, 
    // but here we clear to show loading state clearly
    setGeneratedImages([]);

    try {
      let images: GeneratedImage[] = [];

      if (mode === 'generate') {
        if (selectedModel !== 'imagen-4.0-generate-001' && selectedModel !== 'gemini-2.5-flash-image') {
           throw new Error(`Model "${MODELS.find(m => m.id === selectedModel)?.name}" is a placeholder.`);
        }
        images = await generateImages(prompt, selectedModel, 4, aspectRatio);
      } else {
        if (!uploadedImage) {
          throw new Error('Please upload an image to edit.');
        }
        const base64Data = uploadedImage.split(',')[1];
        images = await editImage(base64Data, uploadedImageMime, prompt);
      }

      setGeneratedImages(images);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-glow-purple/20 border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-800 dark:text-white mb-6">
          AI Creative Studio
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-xl flex">
            <button
              onClick={() => setMode('generate')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                mode === 'generate'
                  ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <SparklesIcon />
              <span>Text to Image</span>
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                mode === 'edit'
                  ? 'bg-white dark:bg-slate-600 text-blue-500 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className="h-5 w-5"><PencilIcon /></div>
              <span>Image Editing</span>
            </button>
          </div>
        </div>

        {/* Edit Mode Upload Area */}
        {mode === 'edit' && (
          <div className="mb-6">
            {!uploadedImage && !showCamera ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadIcon />
                <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-200">
                  Drag & drop your image here
                </p>
                <div className="flex items-center space-x-2 mt-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-600 rounded-full hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-slate-800 dark:text-white font-semibold"
                    >
                        Browse Files
                    </button>
                    <span className="text-slate-400">or</span>
                    <button 
                        onClick={startCamera}
                        className="flex items-center space-x-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold"
                    >
                        <CameraIcon />
                        <span>Camera</span>
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                  PNG, JPG up to 5MB
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            ) : showCamera ? (
               <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-lg bg-black">
                   <video 
                       ref={videoRef} 
                       autoPlay 
                       playsInline 
                       muted
                       onLoadedMetadata={() => videoRef.current?.play()}
                       className="w-full h-64 md:h-96 object-cover"
                   />
                   <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                       <button 
                           onClick={stopCamera}
                           className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
                       >
                           <XIcon />
                       </button>
                       <button 
                           onClick={capturePhoto}
                           className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transform active:scale-95 transition-all"
                       >
                           Capture
                       </button>
                   </div>
               </div>
            ) : (
              <div className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-600 group">
                <img src={uploadedImage || ''} alt="Uploaded preview" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                    onClick={clearUploadedImage}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors flex items-center space-x-2"
                    >
                    <XIcon />
                    <span>Remove Image</span>
                    </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prompt Input */}
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === 'generate'
                ? "A futuristic cityscape at sunset, with flying cars and neon lights, hyperrealistic..."
                : "Describe the changes (e.g., 'Add a retro filter', 'Remove the person in the background')..."
            }
            rows={3}
            className="w-full p-4 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-purple-500 focus:ring-purple-500 rounded-lg transition resize-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white"
            disabled={isLoading}
          />
          
          {/* Quick Edits Chips */}
          {mode === 'edit' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center mr-1">
                <SparklesIcon /> <span className="ml-1">Try:</span>
              </span>
              {QUICK_EDITS.map((edit) => (
                <button
                  key={edit.label}
                  onClick={() => applyQuickEdit(edit.prompt)}
                  className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 rounded-full transition-colors border border-transparent hover:border-blue-300"
                >
                  {edit.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          
          {mode === 'generate' ? (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Aspect Ratio Selector */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                        aspectRatio === ratio.value
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              {/* Model Selector */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full md:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-transparent rounded-lg focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                disabled={isLoading}
              >
                {MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
          ) : (
             <div className="text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Powered by Gemini 2.5 Flash Image
             </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || (mode === 'edit' && !uploadedImage)}
            className={`w-full md:w-auto px-8 py-3 font-bold text-white rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform transform duration-300 flex items-center justify-center space-x-2 ${
              mode === 'edit' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
          >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </>
            ) : (
                <span>{mode === 'generate' ? 'Generate' : 'Edit Image'}</span>
            )}
          </button>
        </div>
        
        {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                {error}
            </div>
        )}
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl mt-12 px-4">
         {generatedImages.length > 0 ? (
             <div className="animate-fade-in">
                 <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white border-l-4 border-purple-500 pl-4">
                     {mode === 'generate' ? 'Generated Results' : 'Edited Results'}
                 </h2>
                 <ImageGrid images={generatedImages} />
             </div>
         ) : !isLoading && mode === 'edit' && uploadedImage ? (
             <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                 Enter a prompt above to edit your image.
             </div>
         ) : null}
         
         {isLoading && (
             <div className="flex flex-col items-center justify-center mt-12">
                 <Spinner />
                 <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                     {mode === 'generate' ? 'Dreaming up your image...' : 'Applying magic edits...'}
                 </p>
             </div>
         )}
      </div>
    </section>
  );
};

export default ImageGenerator;