
import React, { useState, useEffect } from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const mockImages: GalleryImage[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      src: `https://picsum.photos/seed/${i + 10}/500/500`,
      alt: `Random gallery image ${i + 1}`,
    }));
    setImages(mockImages);
  }, []);

  return (
    <section>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-2">
          Community Gallery
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Explore creations from our talented community.
        </p>
      </div>

      <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="search"
            placeholder="Search images..."
            className="flex-grow p-3 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <select className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>All Styles</option>
            <option>Photorealistic</option>
            <option>Anime</option>
            <option>Fantasy</option>
          </select>
          <select className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>All Resolutions</option>
            <option>1024x1024</option>
            <option>512x512</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
