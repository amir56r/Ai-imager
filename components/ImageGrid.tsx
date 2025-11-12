
import React from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { SaveIcon } from './icons/SaveIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ImageGridProps {
  images: GeneratedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const handleDownload = (src: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = src;
    const safePrompt = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `ai-imager-${safePrompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-lg dark:shadow-glow-blue/20 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
          <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 line-clamp-2">
              {image.prompt}
            </p>
            <div className="flex items-center justify-end space-x-2 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
              <button onClick={() => handleDownload(image.src, image.prompt)} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"><DownloadIcon /></button>
              <button onClick={() => alert('Save feature coming soon!')} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"><SaveIcon /></button>
              <button onClick={() => alert('Share feature coming soon!')} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"><ShareIcon /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
