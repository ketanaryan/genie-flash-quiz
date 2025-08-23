
import React, { useState } from 'react';
import { LearningApp } from './LearningApp';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, MessageCircle, BarChart3 } from 'lucide-react';

const Index = () => {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <LearningApp />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            SmartLearn ✨
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Create personalized learning roadmaps with AI-powered daily targets and motivational feedback. 
            Master any subject with structured, adaptive learning paths designed just for you.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-500/30">
              <span className="text-blue-300">🚀 Powered by Gemini AI</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Roadmaps</h3>
            </div>
            <p className="text-slate-300">
              Get personalized learning paths for any subject, from 7 to 365 days
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Daily Targets</h3>
            </div>
            <p className="text-slate-300">
              Clear, achievable goals for each day with curated resources
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Feedback</h3>
            </div>
            <p className="text-slate-300">
              Get motivational feedback and guidance based on your progress
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Progress Tracking</h3>
            </div>
            <p className="text-slate-300">
              Visualize your learning journey and celebrate achievements
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => setShowApp(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Learning Journey
          </Button>
          <p className="text-slate-400 mt-4">
            No credit card required • Free to start
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
