
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calendar, Target, Trash2 } from 'lucide-react';

interface Roadmap {
  id: string;
  subject: string;
  duration_days: number;
  roadmap_data: any;
  created_at: string;
}

interface RoadmapsListProps {
  onSelectRoadmap: (roadmap: Roadmap) => void;
  refreshTrigger: number;
}

export const RoadmapsList: React.FC<RoadmapsListProps> = ({ onSelectRoadmap, refreshTrigger }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_roadmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error: any) {
      console.error('Error fetching roadmaps:', error);
      toast({
        title: "Error",
        description: "Failed to load roadmaps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, subject: string) => {
    if (!confirm(`Are you sure you want to delete the "${subject}" roadmap?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('learning_roadmaps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Deleted",
        description: `"${subject}" roadmap has been deleted`,
      });
      
      fetchRoadmaps();
    } catch (error: any) {
      console.error('Error deleting roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to delete roadmap",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-300">Loading your roadmaps...</div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No roadmaps yet</h3>
        <p className="text-slate-400">Create your first learning roadmap to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <div
          key={roadmap.id}
          className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{roadmap.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{roadmap.duration_days} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{roadmap.roadmap_data?.days?.length || 0} targets</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(roadmap.id, roadmap.subject)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-slate-300 text-sm mb-4">
            Created on {new Date(roadmap.created_at).toLocaleDateString()}
          </p>

          <Button
            onClick={() => onSelectRoadmap(roadmap)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Continue Learning
          </Button>
        </div>
      ))}
    </div>
  );
};
