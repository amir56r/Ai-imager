import React from 'react';
import type { Page } from '../App';
import { PencilIcon } from './icons/PencilIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface LandingPageProps {
  setCurrentPage: (page: Page) => void;
}

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <CheckCircleIcon />
    </div>
    <span className="text-slate-600 dark:text-slate-300">{children}</span>
  </li>
);

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero Section */}
      <div className="relative text-center pt-20 md:pt-32 pb-10 overflow-hidden">
        <div 
            aria-hidden="true" 
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20 dark:opacity-30">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-purple-500 to-cyan-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-4 leading-tight">
            Unleash Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> Imagination</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">
            Turn your wildest ideas into stunning visual art with the power of AI. Describe your vision, and watch it come to life in seconds.
          </p>
          <button
            onClick={() => setCurrentPage('generator')}
            className="px-8 py-4 font-bold text-white text-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition-transform transform duration-300"
          >
            Start Creating Now
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-12">How It Works in 3 Easy Steps</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <PencilIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">1. Describe</h3>
            <p className="text-slate-500 dark:text-slate-400">Write a detailed text prompt describing the image you want to create.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <SettingsIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">2. Customize</h3>
            <p className="text-slate-500 dark:text-slate-400">Choose your preferred AI model and set the perfect aspect ratio.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 mx-auto w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-full">
              <SparklesIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">3. Generate</h3>
            <p className="text-slate-500 dark:text-slate-400">Click the button and watch as AI brings your unique vision to life.</p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">Packed with Powerful Features</h2>
          <ul className="space-y-4">
            <FeatureItem>Access multiple state-of-the-art AI models for diverse artistic styles.</FeatureItem>
            <FeatureItem>Fine-tune your creations with various aspect ratios like Square, Portrait, and Landscape.</FeatureItem>
            <FeatureItem>Download your generated images in high-resolution, ready for any use.</FeatureItem>
            <FeatureItem>Explore a community gallery to get inspired by what others have created.</FeatureItem>
          </ul>
        </div>
        <div className="order-1 md:order-2 bg-slate-100 dark:bg-slate-800 p-8 rounded-xl shadow-lg">
            <img src="https://picsum.photos/seed/feature/600/400" alt="AI Generated Art" className="rounded-lg shadow-2xl" />
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-12">Art Created by AI Imager</h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal1/500/800" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal2/500/500" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal3/500/700" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal4/500/400" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal5/500/600" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal6/500/800" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal7/500/500" />
            <img className="rounded-lg shadow-md" src="https://picsum.photos/seed/gal8/500/700" />
          </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-12">Loved by Creators Everywhere</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 mb-4">"AI Imager has completely transformed my creative process. The quality of the images is simply breathtaking!"</p>
                <p className="font-semibold text-slate-800 dark:text-white">- Alex Doe, Digital Artist</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 mb-4">"This is the most intuitive AI art generator I've ever used. From prompt to final image, it's a seamless experience."</p>
                <p className="font-semibold text-slate-800 dark:text-white">- Jane Smith, Graphic Designer</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 mb-4">"I use it for everything from social media posts to concept art. An indispensable tool for any creator."</p>
                <p className="font-semibold text-slate-800 dark:text-white">- Sam Wilson, Content Creator</p>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center bg-white dark:bg-slate-800 py-16 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Ready to Create Your Masterpiece?</h2>
        <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of creators and start bringing your ideas to life today. No credit card required.
        </p>
        <button
          onClick={() => setCurrentPage('generator')}
          className="px-8 py-4 font-bold text-white text-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition-transform transform duration-300"
        >
          Get Started for Free
        </button>
      </section>

    </div>
  );
};

export default LandingPage;