
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      className="animate-spin-slow h-12 w-12 rounded-full border-4 border-slate-300 border-t-purple-500"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
