
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Privacy Policy</h1>
      <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          At AI Imager, we are committed to protecting your privacy. This is a demo application, and we do not collect or store any personal information beyond what is necessary for the application's functionality (like your user account details, which are stored in your browser's local storage).
        </p>
        <p>
          We do not share your data with any third parties. Prompts and generated images are processed by the AI service but are not associated with your personal account by us.
        </p>
         <h2 className="text-2xl font-semibold mt-6 text-slate-800 dark:text-white">Information We "Collect"</h2>
        <p>
          <strong>Account Information:</strong> When you sign up, we store your username, email, and a (mock) password in your browser's local storage. This is not sent to a server.
        </p>
         <h2 className="text-2xl font-semibold mt-6 text-slate-800 dark:text-white">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us. (This is a placeholder).
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
