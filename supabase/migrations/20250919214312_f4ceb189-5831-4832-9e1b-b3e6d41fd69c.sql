-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create habits table for predefined habits
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  co2_impact DECIMAL(10,2) NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for habits (public read access)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view habits" 
ON public.habits 
FOR SELECT 
USING (true);

-- Create user_habits table for logged activities
CREATE TABLE public.user_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  co2_saved DECIMAL(10,2) NOT NULL,
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

-- Create policies for user_habits
CREATE POLICY "Users can view their own habit logs" 
ON public.user_habits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit logs" 
ON public.user_habits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs" 
ON public.user_habits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs" 
ON public.user_habits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user_stats table for aggregated statistics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_co2_saved DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_habits_logged INTEGER NOT NULL DEFAULT 0,
  impact_points INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined habits
INSERT INTO public.habits (title, description, category, co2_impact, icon) VALUES
('Cycle to work', 'Replace car/public transport with cycling for your commute', 'transport', 2.3, '🚴'),
('Eat plant-based meal', 'Choose a vegetarian or vegan meal instead of meat', 'food', 1.6, '🥗'),
('Use reusable water bottle', 'Avoid single-use plastic water bottles', 'waste', 0.2, '♻️'),
('Turn off devices when not in use', 'Switch off lights, computers, and electronics to save energy', 'energy', 0.5, '💡'),
('Take shorter shower', 'Reduce shower time by 2-3 minutes to save water and energy', 'water', 0.7, '💧'),
('Recycle paper/cardboard', 'Properly recycle paper and cardboard waste', 'waste', 0.9, '📦'),
('Walk instead of drive', 'Choose walking for short trips under 2km', 'transport', 1.8, '🚶'),
('Use stairs instead of elevator', 'Take the stairs to save energy and get exercise', 'energy', 0.3, '🏃'),
('Work from home', 'Avoid commuting by working remotely', 'transport', 4.5, '🏠'),
('Buy local produce', 'Choose locally grown food to reduce transport emissions', 'food', 1.2, '🌱'),
('Air dry clothes', 'Skip the dryer and let clothes air dry naturally', 'energy', 2.3, '👕'),
('Bring reusable shopping bag', 'Use your own bag instead of plastic bags when shopping', 'waste', 0.1, '🛍️');

-- Create function to update user stats after logging habit
CREATE OR REPLACE FUNCTION public.update_user_stats_after_habit_log()
RETURNS TRIGGER AS $$
DECLARE
  user_total_co2 DECIMAL(10,2);
  user_total_habits INTEGER;
  current_streak_count INTEGER;
  user_points INTEGER;
BEGIN
  -- Calculate total CO2 saved
  SELECT COALESCE(SUM(co2_saved), 0) INTO user_total_co2
  FROM public.user_habits 
  WHERE user_id = NEW.user_id;
  
  -- Calculate total habits logged
  SELECT COUNT(*) INTO user_total_habits
  FROM public.user_habits 
  WHERE user_id = NEW.user_id;
  
  -- Calculate current streak
  WITH consecutive_days AS (
    SELECT DISTINCT logged_at,
           logged_at - (ROW_NUMBER() OVER (ORDER BY logged_at))::integer AS grp
    FROM public.user_habits 
    WHERE user_id = NEW.user_id
    ORDER BY logged_at DESC
  ),
  streaks AS (
    SELECT grp, COUNT(*) as streak_length,
           MAX(logged_at) as streak_end
    FROM consecutive_days
    GROUP BY grp
    ORDER BY streak_end DESC
    LIMIT 1
  )
  SELECT COALESCE(streak_length, 0) INTO current_streak_count
  FROM streaks
  WHERE streak_end >= CURRENT_DATE - INTERVAL '1 day';
  
  IF current_streak_count IS NULL THEN
    current_streak_count := 0;
  END IF;
  
  -- Calculate impact points (10 points per kg CO2)
  user_points := FLOOR(user_total_co2 * 10);
  
  -- Update user stats
  UPDATE public.user_stats 
  SET 
    total_co2_saved = user_total_co2,
    total_habits_logged = user_total_habits,
    current_streak = current_streak_count,
    longest_streak = GREATEST(longest_streak, current_streak_count),
    impact_points = user_points,
    last_activity_date = NEW.logged_at,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update stats after habit logging
CREATE TRIGGER update_stats_after_habit_log
  AFTER INSERT ON public.user_habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_after_habit_log();