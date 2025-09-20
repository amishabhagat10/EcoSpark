import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, TrendingUp, Target, Home, Zap, TreePine } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('30 days');
  const { stats, userHabits, loading } = useUserData();

  const timeFilters = ['7 days', '30 days', '90 days'];

  const getCategoryData = () => {
    const categories = {
      transport: { value: 0, color: '#8b5cf6' },
      food: { value: 0, color: '#10b981' },
      energy: { value: 0, color: '#f59e0b' },
      water: { value: 0, color: '#3b82f6' },
      waste: { value: 0, color: '#ef4444' },
      other: { value: 0, color: '#6b7280' }
    };

    userHabits.forEach(habit => {
      const category = habit.habits?.category || 'other';
      if (categories[category]) {
        categories[category].value += parseFloat(habit.co2_saved);
      }
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.value > 0)
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: data.value,
        fill: data.color
      }));
  };

  const getWeeklyProgress = () => {
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayHabits = userHabits.filter(h => h.logged_at === dateStr);
      const co2Saved = dayHabits.reduce((sum, h) => sum + parseFloat(h.co2_saved), 0);
      
      weeklyData.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        co2: co2Saved
      });
    }
    return weeklyData;
  };

  const getMonthlyTrend = () => {
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
      
      const monthHabits = userHabits.filter(h => h.logged_at?.startsWith(monthStr));
      const co2Saved = monthHabits.reduce((sum, h) => sum + parseFloat(h.co2_saved), 0);
      
      monthlyData.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        co2: co2Saved
      });
    }
    return monthlyData;
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categoryData = getCategoryData();
  const weeklyProgress = getWeeklyProgress();
  const monthlyTrend = getMonthlyTrend();

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Impact Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualize your environmental impact and track your progress
          </p>
        </div>
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <Badge
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 ${
                timeFilter === filter 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-eco-blue/10 border-eco-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Last {timeFilter}</p>
                <p className="text-3xl font-bold text-foreground">{(stats?.total_co2_saved || 0).toFixed(1)} kg</p>
                <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
                <p className="text-xs text-eco-blue mt-1">≈ {Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees planted</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-blue">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eco-purple/10 border-eco-purple/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Actions</p>
                <p className="text-3xl font-bold text-foreground">{stats?.total_habits_logged || 0}</p>
                <p className="text-sm text-muted-foreground">Sustainable Actions</p>
                <p className="text-xs text-eco-purple mt-1">{((stats?.total_habits_logged || 0) / 30).toFixed(1)} per day</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-purple">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eco-green/10 border-eco-green/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Average</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.total_habits_logged > 0 
                    ? ((stats?.total_co2_saved || 0) / (stats?.total_habits_logged || 1)).toFixed(2)
                    : '0.00'
                  } kg
                </p>
                <p className="text-sm text-muted-foreground">Daily CO₂ Savings</p>
                <p className="text-xs text-eco-green mt-1">Keep tracking!</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-green">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CO₂ Savings by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              CO₂ Savings by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data available for this time period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-blue"></div>
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="co2" fill="hsl(var(--eco-blue))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6-Month Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-purple"></div>
            6-Month Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="co2" 
                  stroke="hsl(var(--eco-purple))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--eco-purple))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Impact Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-yellow"></div>
              Personal Impact Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-eco-green/10 rounded-lg">
              <TreePine className="h-5 w-5 text-eco-green" />
              <div>
                <p className="font-semibold text-foreground">Forest Impact</p>
                <p className="text-sm text-muted-foreground">
                  equivalent to planting {Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees
                </p>
              </div>
              <span className="ml-auto text-sm font-bold text-eco-green">
                {Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-eco-blue/10 rounded-lg">
              <Home className="h-5 w-5 text-eco-blue" />
              <div>
                <p className="font-semibold text-foreground">Energy Saved</p>
                <p className="text-sm text-muted-foreground">
                  hours of home electricity avoided
                </p>
              </div>
              <span className="ml-auto text-sm font-bold text-eco-blue">
                {Math.floor((stats?.total_co2_saved || 0) * 2)} hours
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-eco-purple/10 rounded-lg">
              <Zap className="h-5 w-5 text-eco-purple" />
              <div>
                <p className="font-semibold text-foreground">Transport Impact</p>
                <p className="text-sm text-muted-foreground">
                  miles of car travel emissions avoided
                </p>
              </div>
              <span className="ml-auto text-sm font-bold text-eco-purple">
                {Math.floor((stats?.total_co2_saved || 0) * 5)} miles
              </span>
            </div>

            <div className="p-4 bg-eco-green/5 rounded-lg">
              <p className="text-sm font-semibold text-eco-green mb-1">Current Streak</p>
              <p className="text-sm text-muted-foreground">
                {stats?.current_streak === 0 
                  ? "Ready to start your sustainability journey!"
                  : `${stats.current_streak} days - keep going!`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Future Impact Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-cyan"></div>
              Future Impact Projections
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on your current pace of {((stats?.total_co2_saved || 0) / Math.max(1, stats?.total_habits_logged || 1)).toFixed(2)} kg CO₂ per day
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { period: '1 Month', days: 30, icon: Calendar },
              { period: '3 Months', days: 90, icon: Calendar },
              { period: '1 Year', days: 365, icon: Calendar }
            ].map(({ period, days, icon: Icon }) => {
              const dailyAvg = (stats?.total_co2_saved || 0) / Math.max(1, stats?.total_habits_logged || 1);
              const projection = dailyAvg * days;
              
              return (
                <div key={period} className="flex items-center gap-3 p-3 bg-eco-cyan/10 rounded-lg">
                  <Icon className="h-5 w-5 text-eco-cyan" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{period}</p>
                    <p className="text-sm text-muted-foreground">
                      {projection.toFixed(1)} kg CO₂ saved
                    </p>
                  </div>
                  <span className="text-sm font-bold text-eco-cyan">
                    ≈ {Math.floor(projection * 0.4)} trees
                  </span>
                </div>
              );
            })}

            <div className="p-4 bg-primary text-primary-foreground rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">Motivation Boost</span>
              </div>
              <p className="text-sm opacity-90">
                Small steps lead to big changes!
              </p>
              <p className="text-xs opacity-75 mt-1">
                Keep logging your habits to increase your impact! 🚀
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="mt-8 bg-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{(stats?.total_co2_saved || 0).toFixed(1)} kg</h3>
          <p className="opacity-90 mb-2">Total CO₂ saved to date</p>
          <p className="text-sm opacity-75">
            Every action counts towards a sustainable future 🌱
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;