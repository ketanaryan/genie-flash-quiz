
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

interface RoadmapCreatorProps {
  onRoadmapCreated: () => void;
}

export const RoadmapCreator: React.FC<RoadmapCreatorProps> = ({ onRoadmapCreated }) => {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject to learn",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/create-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          duration_days: days
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create roadmap');
      }

      toast({
        title: "Success! 🎉",
        description: `Your ${days}-day ${subject} learning roadmap has been created!`,
      });

      onRoadmapCreated();
      setSubject('');
      setDays(30);
    } catch (error: any) {
      console.error('Error creating roadmap:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Create Your Learning Roadmap
          </h2>
          <p className="text-slate-300">
            Tell us what you want to learn and for how long, and we'll create a personalized roadmap for you!
          </p>
        </div>

        <form onSubmit={handleCreateRoadmap} className="space-y-6">
          <div>
            <Label htmlFor="subject" className="text-slate-200 text-lg">
              What do you want to learn? 🎯
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., GitHub, React, Python, Data Science..."
              className="mt-2 bg-slate-700/50 border-slate-600 text-white text-lg p-4"
              required
            />
          </div>

          <div>
            <Label htmlFor="days" className="text-slate-200 text-lg">
              How many days do you want to study? 📅
            </Label>
            <Input
              id="days"
              type="number"
              min="7"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-2 bg-slate-700/50 border-slate-600 text-white text-lg p-4"
            />
            <p className="text-sm text-slate-400 mt-1">
              Choose between 7 and 365 days
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating your roadmap...
              </>
            ) : (
              <>
                Create My Roadmap ✨
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
