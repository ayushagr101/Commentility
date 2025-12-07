import React, { useState } from "react";
import { Youtube, Sparkles, TrendingUp, MessageSquare, ThumbsUp, BarChart3 } from "lucide-react";
import Balatro from "./Balatro";
import Sidebar from "../src/components/Sidebar";

const HomePage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const conversations = [
    { title: "Comment Analysis Session", time: "2h ago" },
    { title: "Sentiment Research", time: "Yesterday" },
    { title: "Topic Modeling Discussion", time: "3 days ago" }
  ];

  const handleAnalyze = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/analyze-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze comments");
      }

      setResults(data.data);
    } catch (err) {
      setError(err.message);
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setYoutubeUrl("");
    setResults(null);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <Balatro isRotate={false} mouseInteraction={false} pixelFilter={700} />
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
        onNewChat={handleNewAnalysis}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="h-16 border-b border-cyan-500 border-opacity-20 flex items-center px-6 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold neon-cyan retro-title">Commentility - YouTube Comment Analyzer</h1>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {!results ? (
              // Input Section
              <div className="animate-fadeIn">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-spin" style={{ animationDuration: '20s' }}>
                    <Youtube className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-5xl font-white neon-cyan mb-4 retro-title flicker">
                    ANALYZE YOUTUBE COMMENTS
                  </h2>
                  <p className="text-xl text-cyan-400 text-opacity-70 mb-2">
                    AI-Powered Sentiment Analysis & Word Cloud Generation
                  </p>
                </div>

                {/* Input Form */}
                <div className="bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl p-8 mb-8">
                  <label className="block text-cyan-400 font-semibold mb-3 text-lg">
                    Enter YouTube Video URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !isAnalyzing && handleAnalyze()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-6 py-4 bg-black bg-opacity-60 rounded-xl text-white border-2 border-cyan-500 border-opacity-30 focus:border-cyan-400 outline-none text-base transition-all"
                      disabled={isAnalyzing}
                    />
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !youtubeUrl.trim()}
                      className={`px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold transition-all shadow-lg shadow-cyan-500/30 ${
                        isAnalyzing || !youtubeUrl.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105 cursor-pointer"
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        "Analyze"
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
                      ⚠️ {error}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <BarChart3 className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-cyan-400 font-semibold text-lg mb-2">Sentiment Analysis</h3>
                    <p className="text-gray-400 text-sm">Analyze positive, negative, and neutral sentiments</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <Sparkles className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-cyan-400 font-semibold text-lg mb-2">Word Cloud</h3>
                    <p className="text-gray-400 text-sm">Visualize most frequent words in comments</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <TrendingUp className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-cyan-400 font-semibold text-lg mb-2">Top Comments</h3>
                    <p className="text-gray-400 text-sm">Discover the most liked comments</p>
                  </div>
                </div>
              </div>
            ) : (
              // Results Section
              <div className="animate-fadeIn space-y-6">
                {/* Header with New Analysis Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold neon-cyan">Analysis Results</h2>
                  <button
                    onClick={handleNewAnalysis}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition-all shadow-lg shadow-cyan-500/30"
                  >
                    New Analysis
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-cyan-400 font-semibold text-lg">Total Comments</h3>
                    </div>
                    <p className="text-4xl font-bold text-white">{results.summary.totalComments}</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-cyan-400 font-semibold text-lg">Net Sentiment</h3>
                    </div>
                    <p className="text-4xl font-bold text-white">{results.summary.netSentiment}</p>
                  </div>
                </div>

                {/* Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.sentimentGraph && (
                    <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                      <h3 className="text-cyan-400 font-semibold text-lg mb-4">Sentiment Distribution</h3>
                      <img src={results.sentimentGraph} alt="Sentiment Graph" className="w-full rounded-lg" />
                    </div>
                  )}
                  
                  {results.wordcloud && (
                    <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                      <h3 className="text-cyan-400 font-semibold text-lg mb-4">Word Cloud</h3>
                      <img src={results.wordcloud} alt="Word Cloud" className="w-full rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Top Comment */}
                {results.summary.topComment && (
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <ThumbsUp className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-cyan-400 font-semibold text-lg">Top Comment</h3>
                    </div>
                    <div className="bg-black bg-opacity-40 p-4 rounded-lg">
                      <p className="text-white mb-2">{results.summary.topComment.text}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>👤 {results.summary.topComment.author}</span>
                        <span>👍 {results.summary.topComment.likes} likes</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top 3 Comments */}
                {results.topComments && results.topComments.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-gray-800 to-black border-2 border-cyan-500 border-opacity-30 rounded-2xl">
                    <h3 className="text-cyan-400 font-semibold text-lg mb-4">Top 3 Comments</h3>
                    <div className="space-y-4">
                      {results.topComments.map((comment, idx) => (
                        <div key={idx} className="bg-black bg-opacity-40 p-4 rounded-lg">
                          <p className="text-white mb-2">{comment.text}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>👤 {comment.author}</span>
                            <span>👍 {comment.likes} likes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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