import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Sparkles, TrendingUp, MessageSquare, Youtube, Zap } from 'lucide-react';
import MeteorShower from './MeteorShower';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Sentiment Analysis',
      description: 'Advanced AI-powered sentiment analysis to understand the emotional tone of YouTube comments',
      color: 'blue'
    },
    {
      icon: Sparkles,
      title: 'AI Summary',
      description: 'Get intelligent, concise summaries of comment themes and key discussion points',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Top Comments',
      description: 'Discover the most liked and engaging comments from your YouTube videos',
      color: 'blue'
    },
    {
      icon: MessageSquare,
      title: 'Comment Insights',
      description: 'Deep dive into comment patterns, trends, and audience engagement metrics',
      color: 'green'
    },
    {
      icon: Youtube,
      title: 'YouTube Integration',
      description: 'Seamless integration with YouTube to analyze any public video instantly',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Fast, efficient analysis powered by cutting-edge machine learning models',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Meteor Shower Background */}
      <MeteorShower />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center max-w-5xl mx-auto fade-in-up">
            {/* Logo/Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shadow-2xl">
              <span className="text-5xl font-bold text-white">C</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-7xl md:text-8xl font-bold professional-title mb-6">
              <span className="gradient-text">Commentility</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-medium">
              AI-Powered YouTube Comment Analysis
            </p>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto">
              Unlock deep insights from YouTube comments with advanced sentiment analysis, 
              AI-generated summaries, and comprehensive engagement metrics
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-xl px-12 py-5 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 py-20 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold professional-title gradient-text mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-slate-400">
                Everything you need to understand your YouTube audience
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colorClass = feature.color === 'blue' ? 'text-blue-400' : 'text-green-400';
                const borderColorClass = feature.color === 'blue' ? 'border-blue-500/30' : 'border-green-500/30';
                
                return (
                  <div
                    key={index}
                    className={`card-professional p-8 hover:border-${feature.color}-500 transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      feature.color === 'blue' 
                        ? 'from-blue-600 to-blue-800' 
                        : 'from-green-600 to-green-800'
                    } flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className={`${colorClass} font-semibold text-2xl mb-3`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-400 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold professional-title mb-6 text-slate-100">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join Commentility today and transform how you understand your YouTube audience
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-success text-xl px-12 py-5 shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
            >
              Create Your Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
