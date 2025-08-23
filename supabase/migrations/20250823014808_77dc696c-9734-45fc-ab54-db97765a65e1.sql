
-- Create table for learning roadmaps
CREATE TABLE public.learning_roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for daily progress tracking
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  user_input TEXT,
  ai_feedback TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roadmap_id, day_number)
);

-- Enable Row Level Security
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_roadmaps
CREATE POLICY "Users can view their own roadmaps" 
  ON public.learning_roadmaps 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roadmaps" 
  ON public.learning_roadmaps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" 
  ON public.learning_roadmaps 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" 
  ON public.learning_roadmaps 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for daily_progress
CREATE POLICY "Users can view progress for their roadmaps" 
  ON public.daily_progress 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.learning_roadmaps 
    WHERE id = daily_progress.roadmap_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create progress for their roadmaps" 
  ON public.daily_progress 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.learning_roadmaps 
    WHERE id = daily_progress.roadmap_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update progress for their roadmaps" 
  ON public.daily_progress 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.learning_roadmaps 
    WHERE id = daily_progress.roadmap_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete progress for their roadmaps" 
  ON public.daily_progress 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.learning_roadmaps 
    WHERE id = daily_progress.roadmap_id 
    AND user_id = auth.uid()
  ));
