
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { RoadmapCreator } from './RoadmapCreator';
import { RoadmapsList } from './RoadmapsList';
import { DailyProgress } from './DailyProgress';
import { LogOut, Plus, BookOpen } from 'lucide-react';

type View = 'list' | 'create' | 'progress';

interface Roadmap {
  id: string;
  subject: string;
  duration_days: number;
  roadmap_data: any;
}

export const LearningDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<View>('list');
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRoadmapCreated = () => {
    setView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectRoadmap = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setView('progress');
  };

  const handleBack = () => {
    setSelectedRoadmap(null);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SmartLearn 🚀
              </h1>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Welcome, {user?.email}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {view === 'list' && (
                <Button
                  onClick={() => setView('create')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Roadmap
                </Button>
              )}
              
              <Button
                onClick={signOut}
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {view === 'create' && (
          <div>
            <Button
              onClick={() => setView('list')}
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 mb-6"
            >
              ← Back to Roadmaps
            </Button>
            <RoadmapCreator onRoadmapCreated={handleRoadmapCreated} />
          </div>
        )}

        {view === 'list' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
              <p className="text-slate-300">Track your progress and achieve your learning goals</p>
            </div>
            <RoadmapsList
              onSelectRoadmap={handleSelectRoadmap}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {view === 'progress' && selectedRoadmap && (
          <DailyProgress
            roadmap={selectedRoadmap}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};
