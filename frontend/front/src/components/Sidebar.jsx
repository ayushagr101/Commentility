import React from "react";
import { Zap, Shield, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ 
  sidebarOpen, 
  conversations, 
  onNewChat 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div 
      className={`relative z-10 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-r border-cyan-500 border-opacity-20 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-white neon-cyan retro-title">Commentility</span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-cyan-500 text-opacity-50 mb-2 font-semibold">RECENT CHATS</div>
          <div className="space-y-2">
            {conversations.map((conv, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-black bg-opacity-40 border border-cyan-500 border-opacity-20 cursor-pointer hover:bg-opacity-60 transition-all"
              >
                <div className="text-sm text-cyan-400 font-medium truncate">{conv.title}</div>
                <div className="text-xs text-cyan-500 text-opacity-50 mt-1">{conv.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t border-cyan-500 border-opacity-20">
          <div className="flex items-center gap-3 p-2 rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-cyan-400">User</div>
              <div className="text-xs text-cyan-500 text-opacity-50">Active</div>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="w-full mt-2 px-4 py-2 bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 text-cyan-400 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all border border-cyan-500 border-opacity-30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
