import { Menu, Plus, Sparkles } from 'lucide-react';

const Header = ({ onNewChat }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-amber-600" />
            <h1 className="text-xl font-semibold text-gray-800">Commentility</h1>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
};

export default Header;