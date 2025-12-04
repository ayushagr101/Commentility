import { Sparkles } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex gap-1">
              <span 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: '0ms' }}
              ></span>
              <span 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: '150ms' }}
              ></span>
              <span 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: '300ms' }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;