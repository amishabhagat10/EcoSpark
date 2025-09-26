import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Zap, Globe, Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Community = () => {
  const [leaderboardFilter, setLeaderboardFilter] = useState('All Time');
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    totalCo2Saved: 0,
    totalActions: 0,
    totalMiles: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const leaderboardFilters = ['All Time', 'This Month', 'This Week'];

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0
    const diff = now.getDate() - day; // Go back to Sunday
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const fetchCommunityData = async () => {
    try {
      setLoading(true);

      // --- Community Stats ---
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('total_co2_saved, total_habits_logged');

      if (statsData) {
        const totalCo2 = statsData.reduce((sum, stat) => sum + parseFloat(stat.total_co2_saved || 0), 0);
        const totalActions = statsData.reduce((sum, stat) => sum + (stat.total_habits_logged || 0), 0);
        const totalMembers = statsData.length;

        setCommunityStats({
          totalMembers,
          totalCo2Saved: totalCo2,
          totalActions,
          totalMiles: Math.floor(totalCo2 / 0.4) // ~0.4kg CO₂ per mile
        });
      }

      // --- Leaderboard ---
      let leaderboardData = [];

      if (leaderboardFilter === 'This Week') {
        const weekStart = getStartOfWeek();

        const { data: weeklyData } = await supabase
          .from('user_habits')
          .select(`user_id, co2_saved, profiles!inner ( display_name, email )`)
          .gte('logged_at', weekStart.toISOString());

        if (weeklyData) {
          const weeklyStats = weeklyData.reduce((acc, habit) => {
            if (!acc[habit.user_id]) {
              acc[habit.user_id] = { user_id: habit.user_id, co2_saved: 0, profiles: habit.profiles };
            }
            acc[habit.user_id].co2_saved += parseFloat(habit.co2_saved || 0);
            return acc;
          }, {});

          leaderboardData = Object.values(weeklyStats);
        }
      } else if (leaderboardFilter === 'This Month') {
        const monthStart = getStartOfMonth();

        const { data: monthlyData } = await supabase
          .from('user_habits')
          .select(`user_id, co2_saved, profiles!inner ( display_name, email )`)
          .gte('logged_at', monthStart.toISOString());

        if (monthlyData) {
          const monthlyStats = monthlyData.reduce((acc, habit) => {
            if (!acc[habit.user_id]) {
              acc[habit.user_id] = { user_id: habit.user_id, co2_saved: 0, profiles: habit.profiles };
            }
            acc[habit.user_id].co2_saved += parseFloat(habit.co2_saved || 0);
            return acc;
          }, {});

          leaderboardData = Object.values(monthlyStats);
        }
      } else {
        const { data } = await supabase
          .from('user_stats')
          .select(`user_id, total_co2_saved, profiles!inner ( display_name, email )`)
          .order('total_co2_saved', { ascending: false })
          .limit(10);

        if (data) {
          leaderboardData = data.map((item) => ({
            user_id: item.user_id,
            co2_saved: parseFloat(item.total_co2_saved || 0),
            profiles: item.profiles
          }));
        }
      }

      if (leaderboardData.length > 0) {
        const sorted = leaderboardData
          .sort((a, b) => b.co2_saved - a.co2_saved)
          .slice(0, 10)
          .map((item, index) => ({
            rank: index + 1,
            name: item.profiles.display_name || item.profiles.email?.split('@')[0] || 'Anonymous',
            co2Saved: item.co2_saved,
            points: Math.floor(item.co2_saved * 10), // unified system
            streak: 0, // optional, you can add real streaks later
            isCurrentUser: item.user_id === user?.id
          }));

        setLeaderboard(sorted);
      }

      // --- Recent Activity ---
      const { data: activityData } = await supabase
        .from('user_habits')
        .select(`*, profiles!inner ( display_name, email ), habits ( title, icon )`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setRecentActivity(activityData.map(item => ({
          name: item.profiles.display_name || item.profiles.email?.split('@')[0] || 'Anonymous',
          action: item.habits.title,
          icon: item.habits.icon,
          co2Saved: parseFloat(item.co2_saved),
          time: new Date(item.created_at).toLocaleDateString()
        })));
      }

    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [user, leaderboardFilter]);

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getBadgeIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold">#{rank}</span>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-eco-purple rounded-full mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Impact</h1>
        <p className="text-lg text-muted-foreground">
          Together we're making a difference! See how your sustainability efforts contribute to our collective environmental impact.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-eco-blue/10 border-eco-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Members</p>
                <p className="text-3xl font-bold text-foreground">{communityStats.totalMembers}</p>
                <p className="text-sm text-muted-foreground">0 active this week</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-blue">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eco-green/10 border-eco-green/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Collective CO₂ Saved</p>
                <p className="text-3xl font-bold text-foreground">{communityStats.totalCo2Saved.toFixed(1)} kg</p>
                <p className="text-sm text-muted-foreground">≈ {Math.floor(communityStats.totalCo2Saved * 0.4)} trees planted</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-green">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eco-purple/10 border-eco-purple/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Actions</p>
                <p className="text-3xl font-bold text-foreground">{communityStats.totalActions}</p>
                <p className="text-sm text-muted-foreground">0.0 kg this week</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-purple">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eco-orange/10 border-eco-orange/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Community Impact</p>
                <p className="text-3xl font-bold text-foreground">{communityStats.totalMiles} miles</p>
                <p className="text-sm text-muted-foreground">car travel emissions avoided</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-orange">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Impact Banner */}
      <Card className="mb-8 bg-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-6 w-6" />
            <span className="font-bold text-lg">Community Impact</span>
          </div>
          <p className="text-2xl font-bold mb-2">Great Start! Every action counts 🌟</p>
          <div className="flex items-center justify-center gap-8 text-sm opacity-90">
            <span>💡 0 hours of home energy saved</span>
            <span>🌳 Equivalent to 0 trees planted</span>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Leaderboard</CardTitle>
            <div className="flex gap-2">
              {leaderboardFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant={leaderboardFilter === filter ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${
                    leaderboardFilter === filter 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setLeaderboardFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    user.isCurrentUser 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {getBadgeIcon(user.rank)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.co2Saved.toFixed(1)} kg CO₂ saved • {user.streak} day streak
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-foreground">{user.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No rankings yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start logging sustainable habits to join the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Community Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Community Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.name}</span> logged{' '}
                      <span className="text-primary">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saved {activity.co2Saved}kg CO₂ • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    
  );
};

export default Community;


      
