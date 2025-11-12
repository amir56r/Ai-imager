
import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { XIcon } from './icons/XIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { Page } from '../App';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}


const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              AI Imager
            </span>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Bringing your imagination to life.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 uppercase dark:text-white">Quick Links</h2>
              <ul className="text-slate-500 dark:text-slate-400 font-medium">
                <li className="mb-4"><button onClick={() => setCurrentPage('about')} className="hover:underline">About</button></li>
                <li className="mb-4"><button onClick={() => setCurrentPage('privacy')} className="hover:underline">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:underline">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-slate-900 uppercase dark:text-white">Follow us</h2>
              <ul className="text-slate-500 dark:text-slate-400 font-medium">
                <li className="mb-4"><a href="#" className="hover:underline ">Instagram</a></li>
                <li className="mb-4"><a href="#" className="hover:underline">X / Twitter</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-slate-200 sm:mx-auto dark:border-slate-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-slate-500 sm:text-center dark:text-slate-400">
            © 2025 AI Imager™. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><FacebookIcon /></a>
            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><InstagramIcon /></a>
            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><XIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
