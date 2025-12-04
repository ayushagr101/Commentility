import { User, Sparkles } from 'lucide-react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`py-8 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600' : 'bg-amber-600'
          }`}>
            {isUser ? (
              <User size={18} className="text-white" />
            ) : (
              <Sparkles size={18} className="text-white" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;