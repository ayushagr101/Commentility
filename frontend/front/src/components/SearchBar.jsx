import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const SearchBar = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative flex items-end bg-white border border-gray-300 rounded-3xl shadow-sm focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-600 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can Claude help you today?"
          disabled={disabled}
          rows={1}
          className="flex-1 px-5 py-4 bg-transparent border-none outline-none resize-none max-h-40 overflow-y-auto text-gray-800 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="m-2 p-2.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
};

export default SearchBar;