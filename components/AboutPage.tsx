
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">About AI Imager</h1>
      <p className="text-slate-600 dark:text-slate-300">
        AI Imager is a project dedicated to exploring the creative potential of artificial intelligence. Our mission is to provide an accessible and powerful tool for artists, designers, and creators of all levels to bring their ideas to life.
      </p>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        This application is built for demonstration purposes, showcasing modern web technologies and the capabilities of generative AI models.
      </p>
    </div>
  );
};

export default AboutPage;
