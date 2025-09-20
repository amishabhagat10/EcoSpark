import React, { useState } from 'react';
import { Plus, Leaf, Zap, Flame, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HabitCard } from '@/components/dashboard/HabitCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const weeklyData = [
  { day: 'Mon', co2: 2.1 },
  { day: 'Tue', co2: 1.8 },
  { day: 'Wed', co2: 2.4 },
  { day: 'Thu', co2: 1.9 },
  { day: 'Fri', co2: 3.1 },
  { day: 'Sat', co2: 2.7 },
  { day: 'Sun', co2: 2.2 },
];

const quickLogHabits = [
  {
    title: "Cycle to work",
    co2Saved: "2.3kg CO₂",
    icon: "🚴",
    bgColor: "bg-eco-blue/10 border-eco-blue/20",
  },
  {
    title: "Eat plant-based meal",
    co2Saved: "1.6kg CO₂",
    icon: "🥗",
    bgColor: "bg-primary/10 border-primary/20",
  },
  {
    title: "Use reusable water bottle",
    co2Saved: "0.2kg CO₂",
    icon: "♻️",
    bgColor: "bg-eco-purple/10 border-eco-purple/20",
  },
  {
    title: "Turn off devices when not in use",
    co2Saved: "0.5kg CO₂",
    icon: "💡",
    bgColor: "bg-eco-yellow/10 border-eco-yellow/20",
  },
  {
    title: "Take shorter shower",
    co2Saved: "0.7kg CO₂",
    icon: "💧",
    bgColor: "bg-eco-cyan/10 border-eco-cyan/20",
  },
  {
    title: "Recycle paper/cardboard",
    co2Saved: "0.9kg CO₂",
    icon: "📦",
    bgColor: "bg-eco-purple/10 border-eco-purple/20",
  },
];

const Dashboard = () => {
  const [todaysCo2, setTodaysCo2] = useState(0.0);
  const [habitsLogged, setHabitsLogged] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { toast } = useToast();

  const handleLogHabit = (habit: typeof quickLogHabits[0]) => {
    const co2Value = parseFloat(habit.co2Saved.replace('kg CO₂', ''));
    setTodaysCo2(prev => prev + co2Value);
    setHabitsLogged(prev => prev + 1);
    
    toast({
      title: "Habit logged! 🌱",
      description: `Great job! You saved ${habit.co2Saved} by ${habit.title.toLowerCase()}.`,
    });
  };

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Amisha!
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
          value={`${todaysCo2.toFixed(1)} kg`}
          subtitle="≈ 1 plastic bottle recycled"
          icon={Leaf}
          iconBg="bg-primary"
        />
        <StatsCard
          title="Actions"
          value={habitsLogged.toString()}
          subtitle={habitsLogged === 0 ? "Let's get started!" : "Habits logged"}
          icon={Zap}
          iconBg="bg-eco-cyan"
        />
        <StatsCard
          title="Streak"
          value={`${currentStreak} days`}
          subtitle={currentStreak === 0 ? "Start your streak today!" : "Current Streak"}
          icon={Flame}
          iconBg="bg-eco-orange"
        />
        <StatsCard
          title="Total"
          value="10.2 kg"
          subtitle="≈ 4 trees planted"
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
            {quickLogHabits.map((habit, index) => (
              <HabitCard
                key={index}
                title={habit.title}
                co2Saved={habit.co2Saved}
                icon={habit.icon}
                bgColor={habit.bgColor}
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
                  <p className="text-3xl font-bold text-foreground">70</p>
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
                    <Bar dataKey="co2" fill="hsl(var(--eco-primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-primary">10.2 kg</p>
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
                Keep logging habits to increase your impact! 
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;