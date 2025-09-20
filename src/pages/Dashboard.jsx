import React from 'react';
import { Plus, Leaf, Zap, Flame, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HabitCard } from '@/components/dashboard/HabitCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, stats, habits, loading, logHabit, getTodayStats, getWeeklyData } = useUserData();
  const { toast } = useToast();

  const todayStats = getTodayStats();
  const weeklyData = getWeeklyData();

  const handleLogHabit = async (habit) => {
    const result = await logHabit(habit.id, habit.co2_impact);
    
    if (result.success) {
      toast({
        title: "Habit logged! 🌱",
        description: `Great job! You saved ${habit.co2_impact}kg CO₂ by ${habit.title.toLowerCase()}.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to log habit",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Friend';

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to make a positive impact today?
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Log New Habit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today"
          value={`${todayStats.co2Saved.toFixed(1)} kg`}
          subtitle={todayStats.co2Saved > 0 ? `≈ ${Math.floor(todayStats.co2Saved * 0.5)} plastic bottles recycled` : "Let's get started!"}
          icon={Leaf}
          iconBg="bg-primary"
        />
        <StatsCard
          title="Actions"
          value={todayStats.habitsLogged.toString()}
          subtitle={todayStats.habitsLogged === 0 ? "Let's get started!" : "Habits logged today"}
          icon={Zap}
          iconBg="bg-eco-cyan"
        />
        <StatsCard
          title="Streak"
          value={`${stats?.current_streak || 0} days`}
          subtitle={stats?.current_streak === 0 ? "Start your streak today!" : "Current Streak"}
          icon={Flame}
          iconBg="bg-eco-orange"
        />
        <StatsCard
          title="Total"
          value={`${stats?.total_co2_saved || 0} kg`}
          subtitle={`≈ ${Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees planted`}
          icon={Target}
          iconBg="bg-eco-yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Log Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Quick Log</h2>
            <p className="text-muted-foreground">One-click logging for your daily habits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.slice(0, 6).map((habit) => (
              <HabitCard
                key={habit.id}
                title={habit.title}
                co2Saved={`${habit.co2_impact}kg CO₂`}
                icon={habit.icon}
                bgColor={`bg-category-${habit.category}/10 border-category-${habit.category}/20`}
                onLog={() => handleLogHabit(habit)}
              />
            ))}
          </div>
        </div>

        {/* Weekly Progress & Points */}
        <div className="space-y-6">
          {/* Points Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Points</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.impact_points || 0}</p>
                  <p className="text-sm text-muted-foreground">Impact Points</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-purple">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto text-eco-purple">
                View Leaderboard →
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your CO₂ savings over the last 7 days
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="co2" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {weeklyData.reduce((sum, day) => sum + day.co2, 0).toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
            </CardContent>
          </Card>

          {/* Today's Impact */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5" />
                <span className="font-semibold">Today's Impact</span>
              </div>
              <p className="text-sm opacity-90">
                {todayStats.habitsLogged > 0 
                  ? `You've logged ${todayStats.habitsLogged} habits today! Keep it up!`
                  : "Keep logging habits to increase your impact!"
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;