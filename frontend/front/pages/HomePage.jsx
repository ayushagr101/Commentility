import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Zap, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Balatro from "./Balatro";
import Sidebar from "../src/components/Sidebar";

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const examplePrompts = [
    { icon: "💬", text: "What can Commentility do?" },
    { icon: "🎯", text: "Help me analyze comments" },
    { icon: "🚀", text: "Show me trending topics" },
    { icon: "💡", text: "Explain sentiment analysis" }
  ];

  const conversations = [
    { title: "Comment Analysis Session", time: "2h ago" },
    { title: "Sentiment Research", time: "Yesterday" },
    { title: "Topic Modeling Discussion", time: "3 days ago" }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Welcome to Commentility! I'm here to help you analyze comments and understand sentiment patterns.",
        "Hello! I'm your AI assistant. What would you like to know about comment analysis?",
        "I'm detecting your query. Let me analyze the situation and provide you with the best possible response.",
        "Great question! Let's explore this together. How can I assist you today?"
      ];
      
      const aiMessage = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (text) => {
    setInput(text);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Animated Background with Balatro */}
      <div className="absolute inset-0 opacity-20">
        <Balatro
  isRotate={false}
  mouseInteraction={false}
  pixelFilter={700}
/>
      </div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        conversations={conversations}
        onNewChat={() => {
          setMessages([]);
          setInput("");
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="h-16 border-b border-cyan-500 border-opacity-20 flex items-center px-6 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-cyan-500 hover:bg-opacity-10 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold neon-cyan retro-title">Commentility AI Assistant</h1>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-12 animate-fadeIn">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-spin" style={{ animationDuration: '20s' }}>
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-5xl font-white neon-cyan mb-4 retro-title flicker">
                  WELCOME TO COMMENTILITY
                </h2>
                <p className="text-xl text-cyan-400 text-opacity-70 mb-2">
                  AI-Powered Comment Analysis
                </p>
              </div>

              {/* Example Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl hover:border-opacity-60 hover:scale-[1.02] transition-all text-left group"
                  >
                    <div className="text-3xl mb-3">{prompt.icon}</div>
                    <div className="text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                      {prompt.text}
                    </div>
                  </button>
                ))}
              </div>

              {/* Features */}
              
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 animate-fadeIn ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                        : "bg-gray-800 bg-opacity-60 border border-cyan-500 border-opacity-30 text-cyan-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-400 font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4 animate-fadeIn">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-800 bg-opacity-60 border border-cyan-500 border-opacity-30 p-4 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-red-600 border-opacity-20 p-6 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Send a message to Commentility..."
                className="w-full px-6 py-4 pr-14 bg-black bg-opacity-60 rounded-2xl text-white border-2 border-cyan-500 border-opacity-30 focus:border-cyan-400 outline-none text-base transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center transition-all shadow-lg shadow-cyan-500/30 ${
                  input.trim() && !isTyping
                    ? "opacity-100 hover:scale-105 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="mt-3 text-center text-xs text-cyan-500 text-opacity-40">
              Powered by Commentility • AI Assistant v1.0
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;