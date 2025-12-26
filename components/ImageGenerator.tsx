
import React, { useState, useRef, useEffect } from 'react';
import { MODELS, ASPECT_RATIOS, IMAGE_SIZES } from '../constants';
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
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  // Edit Mode State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageMime, setUploadedImageMime] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const checkApiKeyRequirement = async () => {
    if (selectedModel === 'gemini-3-pro-image-preview' || selectedModel === 'imagen-4.0-generate-001') {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setShowKeyPrompt(true);
          return false;
        }
      }
    }
    return true;
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setShowKeyPrompt(false);
      // Proceeding directly as per race condition instructions
      handleGenerate();
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setUploadedImageMime(file.type);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
        setUploadedImage(canvas.toDataURL('image/jpeg'));
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

  const handleGenerate = async () => {
    if (!prompt.trim() && mode === 'generate') {
      setError('Please enter a prompt.');
      return;
    }

    const ready = await checkApiKeyRequirement();
    if (!ready) return;

    setError(null);
    setIsLoading(true);
    setGeneratedImages([]);

    try {
      let images: GeneratedImage[] = [];
      if (mode === 'generate') {
        images = await generateImages(prompt, selectedModel, 1, aspectRatio, imageSize);
      } else {
        if (!uploadedImage) throw new Error('Please upload an image.');
        const base64Data = uploadedImage.split(',')[1];
        images = await editImage(base64Data, uploadedImageMime, prompt);
      }
      setGeneratedImages(images);
    } catch (err: any) {
      if (err.message === "API_KEY_RESET_REQUIRED") {
        setShowKeyPrompt(true);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      {/* Key Requirement Modal */}
      {showKeyPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">API Key Required</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This high-quality model requires a paid Google Cloud Project API key. 
              <br />
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn about billing</a>
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleOpenSelectKey} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                Select API Key
              </button>
              <button onClick={() => {setShowKeyPrompt(false); setSelectedModel('gemini-2.5-flash-image');}} className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Use Fast Model Instead
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full p-8 bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700/50 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            CREATIVE STUDIO
          </h1>
          <div className="bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-2xl flex">
            <button
              onClick={() => setMode('generate')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'generate' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <SparklesIcon /> <span>Create</span>
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'edit' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <div className="w-5 h-5"><PencilIcon /></div> <span>Edit</span>
            </button>
          </div>
        </div>

        {mode === 'edit' && (
          <div className="mb-8">
            {!uploadedImage && !showCamera ? (
              <div 
                className={`group border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/30'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadIcon />
                </div>
                <p className="text-xl font-bold text-slate-800 dark:text-white mb-2">Drop your image here</p>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">Browse Files</button>
                  <button onClick={startCamera} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"><CameraIcon /> Camera</button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            ) : showCamera ? (
              <div className="relative aspect-video max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black">
                <video ref={videoRef} autoPlay playsInline muted onLoadedMetadata={() => videoRef.current?.play()} className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                  <button onClick={stopCamera} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"><XIcon /></button>
                  <button onClick={capturePhoto} className="px-8 py-3 bg-white text-slate-900 font-black rounded-full shadow-2xl hover:bg-slate-100 transition-colors active:scale-95">CAPTURE</button>
                </div>
              </div>
            ) : (
              <div className="relative group max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                <img src={uploadedImage || ''} alt="Preview" className="w-full h-auto" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                  <button onClick={() => setUploadedImage(null)} className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-xl hover:bg-red-600 transition-all flex items-center gap-2">
                    <XIcon /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "Describe the scene in detail... (e.g. 'A futuristic astronaut exploring a neon jungle, cinematic lighting')" : "What do you want to change? (e.g. 'Change the sky to a purple sunset')"}
              className="w-full p-6 bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-3xl transition-all resize-none text-lg min-h-[140px] text-slate-900 dark:text-white"
            />
            {mode === 'edit' && (
              <div className="flex flex-wrap gap-2 mt-4 px-2">
                {QUICK_EDITS.map((edit) => (
                  <button key={edit.label} onClick={() => setPrompt(edit.prompt)} className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-slate-200 rounded-full hover:border-blue-400 dark:hover:border-blue-400 hover:text-blue-500 transition-all shadow-sm">
                    {edit.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Model</label>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full p-3.5 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold text-sm text-slate-800 dark:text-white appearance-none border-2 border-transparent focus:border-blue-500 cursor-pointer">
                {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Ratio</label>
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-2xl">
                  {ASPECT_RATIOS.slice(0, 3).map(r => (
                    <button key={r.value} onClick={() => setAspectRatio(r.value)} className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-tighter ${aspectRatio === r.value ? 'bg-white dark:bg-slate-500 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500'}`}>{r.label}</button>
                  ))}
                </div>
              </div>
              {selectedModel === 'gemini-3-pro-image-preview' && (
                <div className="flex-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Quality</label>
                  <select value={imageSize} onChange={(e) => setImageSize(e.target.value as any)} className="w-full p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl font-black text-[10px] uppercase text-slate-800 dark:text-white appearance-none border-2 border-transparent focus:border-blue-500 cursor-pointer">
                    {IMAGE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || (mode === 'edit' && !uploadedImage)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale disabled:translate-y-0 uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>{mode === 'generate' ? 'Generate Art' : 'Magic Edit'}</span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {generatedImages.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase">Results</h2>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <ImageGrid images={generatedImages} />
          </div>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center py-20">
            <Spinner />
            <p className="mt-8 text-xl font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {mode === 'generate' ? 'Synthesizing Vision...' : 'Recalculating Pixels...'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGenerator;
