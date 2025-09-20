import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [userHabits, setUserHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // Fetch user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // Fetch all habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .order('title');
      
      // Fetch user's logged habits
      const { data: userHabitsData } = await supabase
        .from('user_habits')
        .select(`
          *,
          habits (
            title,
            category,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setProfile(profileData);
      setStats(statsData || {
        total_co2_saved: 0,
        current_streak: 0,
        longest_streak: 0,
        total_habits_logged: 0,
        impact_points: 0
      });
      setHabits(habitsData || []);
      setUserHabits(userHabitsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logHabit = async (habitId, co2Saved) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_habits')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          co2_saved: co2Saved,
          logged_at: new Date().toISOString().split('T')[0]
        });
      
      if (error) throw error;
      
      // Refresh data
      await fetchUserData();
      return { success: true };
    } catch (error) {
      console.error('Error logging habit:', error);
      return { success: false, error: error.message };
    }
  };

  const getTodayStats = () => {
    if (!userHabits.length) return { co2Saved: 0, habitsLogged: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const todayHabits = userHabits.filter(h => h.logged_at === today);
    
    return {
      co2Saved: todayHabits.reduce((sum, h) => sum + parseFloat(h.co2_saved), 0),
      habitsLogged: todayHabits.length
    };
  };

  const getWeeklyData = () => {
    if (!userHabits.length) return [];
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayHabits = userHabits.filter(h => h.logged_at === dateStr);
      const co2Saved = dayHabits.reduce((sum, h) => sum + parseFloat(h.co2_saved), 0);
      
      weeklyData.push({
        day: days[date.getDay()],
        co2: co2Saved
      });
    }
    
    return weeklyData;
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    profile,
    stats,
    habits,
    userHabits,
    loading,
    logHabit,
    getTodayStats,
    getWeeklyData,
    refreshData: fetchUserData
  };
};