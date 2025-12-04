

import { Sparkles } from 'lucide-react';

const EmptyState = () => {
  const suggestions = [
    "Help me write a professional email",
    "Explain quantum computing simply",
    "Create a workout plan for beginners",
    "Debug my JavaScript code"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <Sparkles size={32} className="text-amber-600" />
      </div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">
        How can I help you today?
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        I'm Commentility, an AI assistant. I can analyze your comments and provide insights.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="p-4 text-left border border-gray-200 rounded-xl hover:border-amber-600 hover:bg-amber-50 transition-all group"
          >
            <p className="text-sm text-gray-700 group-hover:text-gray-900">
              {suggestion}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;