import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, Calendar, Target, MessageCircle, Loader2 } from 'lucide-react';

interface DailyProgressProps {
  roadmap: {
    id: string;
    subject: string;
    duration_days: number;
    roadmap_data: any;
  };
  onBack: () => void;
}

interface DayProgress {
  id?: string;
  day_number: number;
  user_input?: string;
  ai_feedback?: string;
  completed: boolean;
}

export const DailyProgress: React.FC<DailyProgressProps> = ({ roadmap, onBack }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [progress, setProgress] = useState<Record<number, DayProgress>>({});
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, [roadmap.id]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('roadmap_id', roadmap.id)
        .order('day_number');

      if (error) throw error;

      const progressMap: Record<number, DayProgress> = {};
      data?.forEach((item) => {
        progressMap[item.day_number] = {
          id: item.id,
          day_number: item.day_number,
          user_input: item.user_input,
          ai_feedback: item.ai_feedback,
          completed: item.completed,
        };
      });

      setProgress(progressMap);

      // Find the next day to work on
      const lastCompletedDay = data?.filter(item => item.completed).sort((a, b) => b.day_number - a.day_number)[0];
      const nextDay = lastCompletedDay ? Math.min(lastCompletedDay.day_number + 1, roadmap.duration_days) : 1;
      setCurrentDay(nextDay);

      // Set user input for current day if exists
      const currentDayProgress = progressMap[nextDay];
      if (currentDayProgress?.user_input) {
        setUserInput(currentDayProgress.user_input);
      }
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      toast({
        title: "Error",
        description: "Failed to load progress",
        variant: "destructive",
      });
    }
  };

  const handleSubmitProgress = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter what you did today",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setFeedbackLoading(true);

    try {
      // Save user input first
      const { data: progressData, error: progressError } = await supabase
        .from('daily_progress')
        .upsert({
          roadmap_id: roadmap.id,
          day_number: currentDay,
          user_input: userInput.trim(),
          completed: true,
        })
        .select()
        .single();

      if (progressError) throw progressError;

      // Get AI feedback using Supabase edge function
      const { data: feedbackData, error: feedbackError } = await supabase.functions.invoke('get-feedback', {
        body: {
          subject: roadmap.subject,
          dayNumber: currentDay,
          dayTarget: roadmap.roadmap_data?.days?.[currentDay - 1]?.target || '',
          userInput: userInput.trim(),
        },
      });

      if (feedbackError) {
        console.error('Feedback error:', feedbackError);
        throw new Error('Failed to get AI feedback');
      }

      const feedback = feedbackData?.feedback || 'Great job on completing today\'s task! Keep up the excellent work! 🎉';

      // Update with AI feedback
      const { error: updateError } = await supabase
        .from('daily_progress')
        .update({ ai_feedback: feedback })
        .eq('id', progressData.id);

      if (updateError) throw updateError;

      // Update local state
      setProgress(prev => ({
        ...prev,
        [currentDay]: {
          id: progressData.id,
          day_number: currentDay,
          user_input: userInput.trim(),
          ai_feedback: feedback,
          completed: true,
        }
      }));

      toast({
        title: "Great job! 🎉",
        description: "Your progress has been recorded and you've received AI feedback!",
      });

      // Move to next day
      if (currentDay < roadmap.duration_days) {
        setCurrentDay(currentDay + 1);
        setUserInput('');
      }
    } catch (error: any) {
      console.error('Error submitting progress:', error);
      toast({
        title: "Error",
        description: "Failed to submit progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFeedbackLoading(false);
    }
  };

  const currentDayData = roadmap.roadmap_data?.days?.[currentDay - 1];
  const currentProgress = progress[currentDay];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 mb-4"
        >
          ← Back to Roadmaps
        </Button>
        
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{roadmap.subject} Learning Journey</h1>
              <p className="text-slate-300">{roadmap.duration_days} day roadmap</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-400">
                Day {currentDay} of {roadmap.duration_days}
              </div>
              <div className="text-sm text-slate-400">
                {Object.values(progress).filter(p => p.completed).length} days completed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(Object.values(progress).filter(p => p.completed).length / roadmap.duration_days) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Target */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Today's Target</h2>
          </div>
          
          {currentDayData ? (
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                {currentDayData.title}
              </h3>
              <p className="text-slate-300 mb-4">{currentDayData.target}</p>
              {currentDayData.resources && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Resources:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {currentDayData.resources.map((resource: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400">Loading today's target...</p>
          )}
        </div>

        {/* Progress Input */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Your Progress</h2>
          </div>

          {!currentProgress?.completed ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="progress" className="text-slate-200">
                  What did you accomplish today? 📝
                </Label>
                <textarea
                  id="progress"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Describe what you learned, practiced, or completed today..."
                  className="mt-2 w-full h-32 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleSubmitProgress}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Progress
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Day {currentDay} Completed!</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">What you did:</h4>
                <p className="text-slate-300 bg-slate-700/30 p-3 rounded-lg">
                  {currentProgress.user_input}
                </p>
              </div>

              {currentProgress.ai_feedback && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                    <h4 className="text-sm font-medium text-blue-400">AI Feedback:</h4>
                  </div>
                  <p className="text-slate-300 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    {currentProgress.ai_feedback}
                  </p>
                </div>
              )}

              {feedbackLoading && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting AI feedback...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mt-8 bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-4">Progress Overview</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: roadmap.duration_days }, (_, i) => i + 1).map((day) => {
            const dayProgress = progress[day];
            const isCompleted = dayProgress?.completed;
            const isCurrent = day === currentDay;
            
            return (
              <div
                key={day}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : isCurrent
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-700/30 border-slate-600/50 text-slate-400'
                }`}
                onClick={() => {
                  if (isCompleted) {
                    setCurrentDay(day);
                    setUserInput(dayProgress.user_input || '');
                  }
                }}
              >
                <div className="font-medium">Day {day}</div>
                {isCompleted && <CheckCircle className="h-4 w-4 mx-auto mt-1" />}
                {isCurrent && !isCompleted && <span className="text-xs">Current</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
