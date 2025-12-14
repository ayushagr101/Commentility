import React, { useState } from "react";
import { Youtube, Sparkles, TrendingUp, MessageSquare, ThumbsUp, BarChart3, Menu } from "lucide-react";
import Sidebar from "../src/components/Sidebar";
import MeteorShower from "./MeteorShower";

const HomePage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshHistory, setRefreshHistory] = useState(0); // Trigger for history refresh

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
        credentials: 'include', // Send cookies
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze comments");
      }

      setResults(data.data);
      setRefreshHistory(prev => prev + 1); // Trigger history refresh
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

  const handleHistorySelect = async (historyId) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/v1/users/history/${historyId}`, {
        credentials: 'include' // Send cookies
      });

      if (!response.ok) {
        throw new Error('Failed to load analysis');
      }

      const data = await response.json();
      setResults(data.data);
      setYoutubeUrl(''); // Clear URL input when viewing history
    } catch (err) {
      setError(err.message);
      console.error('History load error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Meteor Shower Background */}
      <MeteorShower />
      
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-50" />
      
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        onHistorySelect={handleHistorySelect}
        refreshTrigger={refreshHistory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="h-16 border-b border-slate-700 flex items-center px-6 bg-slate-800/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold professional-title gradient-text">
              Commentility - YouTube Comment Analyzer
            </h1>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {!results ? (
              // Input Section
              <div className="fade-in-up">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-xl">
                    <Youtube className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-5xl font-bold professional-title mb-4 text-slate-100">
                    Analyze YouTube Comments
                  </h2>
                  <p className="text-xl text-slate-400 mb-2">
                    AI-Powered Sentiment Analysis & Insights
                  </p>
                </div>

                {/* Input Form */}
                <div className="card-professional p-8 mb-8">
                  <label className="block text-blue-400 font-semibold mb-3 text-lg">
                    Enter YouTube Video URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !isAnalyzing && handleAnalyze()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-6 py-4 bg-slate-800 rounded-xl text-white border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-base transition-all"
                      disabled={isAnalyzing}
                    />
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !youtubeUrl.trim()}
                      className={`btn-primary ${
                        isAnalyzing || !youtubeUrl.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
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
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                      ⚠️ {error}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card-professional p-6">
                    <BarChart3 className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-blue-400 font-semibold text-lg mb-2">Sentiment Analysis</h3>
                    <p className="text-slate-400 text-sm">Analyze positive, negative, and neutral sentiments</p>
                  </div>
                  <div className="card-professional p-6">
                    <Sparkles className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-green-400 font-semibold text-lg mb-2">AI Summary</h3>
                    <p className="text-slate-400 text-sm">Get intelligent summaries of comment themes</p>
                  </div>
                  <div className="card-professional p-6">
                    <TrendingUp className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-blue-400 font-semibold text-lg mb-2">Top Comments</h3>
                    <p className="text-slate-400 text-sm">Discover the most liked comments</p>
                  </div>
                </div>
              </div>
            ) : (
              // Results Section
              <div className="fade-in-up space-y-6">
                {/* Video Title */}
                {results.summary.videoTitle && (
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold professional-title text-slate-100 mb-2">
                      {results.summary.videoTitle}
                    </h2>
                    {results.summary.channelTitle && (
                      <p className="text-slate-400">By {results.summary.channelTitle}</p>
                    )}
                  </div>
                )}
                
                {/* Header with New Analysis Button */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold professional-title gradient-text">Analysis Results</h3>
                  <button
                    onClick={handleNewAnalysis}
                    className="btn-success"
                  >
                    New Analysis
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-professional p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                      <h3 className="text-blue-400 font-semibold text-lg">Total Comments</h3>
                    </div>
                    <p className="text-4xl font-bold text-white">{results.summary.totalComments}</p>
                  </div>
                  
                  <div className="card-professional p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      <h3 className="text-green-400 font-semibold text-lg">Net Sentiment</h3>

                    </div>
                    <p className="text-4xl font-bold text-white">{results.summary.netSentiment}</p>
                  </div>
                </div>

                {/* Comment Summary */}
                {results.summary.commentSummary && (
                  <div className="card-professional p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-green-400" />
                      <h3 className="text-green-400 font-semibold text-lg">AI-Powered Comment Summary</h3>
                    </div>
                    <div className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
                      {results.summary.commentSummary}
                    </div>
                  </div>
                )}

                {/* Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.sentimentGraph && (
                    <div className="card-professional p-6">
                      <h3 className="text-blue-400 font-semibold text-lg mb-4">Sentiment Distribution</h3>
                      <img src={results.sentimentGraph} alt="Sentiment Graph" className="w-full rounded-lg" />
                    </div>
                  )}
                  
                  {results.wordcloud && (
                    <div className="card-professional p-6">
                      <h3 className="text-green-400 font-semibold text-lg mb-4">Word Cloud</h3>
                      <img src={results.wordcloud} alt="Word Cloud" className="w-full rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Top Comment */}
                {results.summary.topComment && (
                  <div className="card-professional p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ThumbsUp className="w-6 h-6 text-blue-400" />
                      <h3 className="text-blue-400 font-semibold text-lg">Top Comment</h3>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                      <p className="text-white mb-2">{results.summary.topComment.text}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>👤 {results.summary.topComment.author}</span>
                        <span>👍 {results.summary.topComment.likes} likes</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top 3 Comments */}
                {results.topComments && results.topComments.length > 0 && (
                  <div className="card-professional p-6">
                    <h3 className="text-blue-400 font-semibold text-lg mb-4">Top 3 Comments</h3>
                    <div className="space-y-4">
                      {results.topComments.map((comment, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-white mb-2">{comment.text}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
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
    </div>
  );
};

export default HomePage;