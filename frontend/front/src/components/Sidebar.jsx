import React, { useState, useEffect } from "react";
import { Shield, LogOut, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ 
  sidebarOpen, 
  onHistorySelect,
  refreshTrigger = 0 
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's analysis history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/users/history', {
          credentials: 'include' // Send cookies
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sidebarOpen) {
      fetchHistory();
    }
  }, [sidebarOpen, refreshTrigger]); // Re-fetch when refreshTrigger changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`relative z-10 bg-slate-800 border-r border-slate-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <span className="text-xl font-bold professional-title gradient-text">Commentility</span>
        </div>

        {/* Analysis History */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Analysis History
          </div>
          
          {loading ? (
            <div className="text-slate-400 text-sm text-center py-4">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-4">
              No analysis yet
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => onHistorySelect(item._id)}
                  className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:bg-slate-700 hover:border-blue-500 transition-all group"
                >
                  <div className="text-sm text-slate-200 font-medium truncate group-hover:text-blue-400 transition-colors">
                    {item.videoTitle}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3 p-2 rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate">
                {user?.username || user?.email || 'User'}
              </div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="w-full mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-600 hover:border-slate-500"
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
