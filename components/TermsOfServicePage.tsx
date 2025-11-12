
import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Terms of Service</h1>
      <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          Welcome to AI Imager! By using our application, you agree to these terms of service.
        </p>
        <p>
          <strong>1. Use of Service:</strong> This service is provided for creative and demonstrative purposes. You agree not to use the service to generate illegal, harmful, or offensive content.
        </p>
        <p>
          <strong>2. Ownership:</strong> You retain the rights to the text prompts you provide. The ownership of AI-generated images may be subject to the policies of the underlying AI model provider.
        </p>
        <p>
          <strong>3. Disclaimer:</strong> This service is provided "as is" without any warranties. We are not responsible for the content generated or any consequences of its use.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
