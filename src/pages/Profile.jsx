import React, { useState } from 'react';
import { Share, Download, Clock, Flame, Target, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState('Overview');
  const { user } = useAuth();
  const { profile, stats, userHabits, loading } = useUserData();

  const tabs = ['Overview'];

  const getRecentActivity = () => {
    return userHabits.slice(0, 10).map(habit => ({
      id: habit.id,
      action: habit.habits?.title || 'Unknown Action',
      icon: habit.habits?.icon || '🌱',
      co2Saved: parseFloat(habit.co2_saved),
      date: new Date(habit.created_at).toLocaleDateString(),
      time: new Date(habit.created_at).toLocaleTimeString()
    }));
  };

  const getAchievementLevel = () => {
    const totalCo2 = stats?.total_co2_saved || 0;
    if (totalCo2 >= 100) return { level: 'Eco Master', description: 'Leading the green revolution!', color: 'bg-eco-green' };
    if (totalCo2 >= 50) return { level: 'Climate Champion', description: 'Making significant impact!', color: 'bg-eco-blue' };
    if (totalCo2 >= 20) return { level: 'Green Warrior', description: 'Building sustainable habits!', color: 'bg-eco-purple' };
    if (totalCo2 >= 5) return { level: 'Eco Enthusiast', description: 'Great start on your journey!', color: 'bg-eco-yellow' };
    return { level: 'Getting Started', description: 'Keep logging habits to reach the next level!', color: 'bg-eco-orange' };
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const recentActivity = getRecentActivity();
  const achievement = getAchievementLevel();

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
            <p className="text-lg text-muted-foreground">
              Sustainability Champion • {stats?.total_habits_logged || 0} badges earned
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? 'default' : 'outline'}
            onClick={() => setSelectedTab(tab)}
            className={selectedTab === tab ? 'bg-eco-yellow text-foreground' : ''}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'Overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-eco-orange/10 border-eco-orange/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Current Streak</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.current_streak || 0} days</p>
                    <p className="text-sm text-muted-foreground">Best: {stats?.longest_streak || 0}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-orange">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-eco-green/10 border-eco-green/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total CO₂ Saved</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.total_co2_saved || 0} kg</p>
                    <p className="text-sm text-muted-foreground">≈ {Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees planted</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-green">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-eco-blue/10 border-eco-blue/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">This Month</p>
                    <p className="text-3xl font-bold text-foreground">
                      {userHabits
                        .filter(h => {
                          const habitMonth = new Date(h.created_at).getMonth();
                          const currentMonth = new Date().getMonth();
                          return habitMonth === currentMonth;
                        })
                        .reduce((sum, h) => sum + parseFloat(h.co2_saved), 0)
                        .toFixed(1)
                      } kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userHabits.filter(h => {
                        const habitMonth = new Date(h.created_at).getMonth();
                        const currentMonth = new Date().getMonth();
                        return habitMonth === currentMonth;
                      }).length} actions logged
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-blue">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-eco-purple/10 border-eco-purple/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Impact Points</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.impact_points || 0}</p>
                    <p className="text-sm text-muted-foreground">0 this week</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-purple">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            Saved {activity.co2Saved}kg CO₂ • {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No recent activity</h3>
                    <p className="text-muted-foreground">
                      Start logging habits to see your progress!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Impact Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Environmental Impact */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Environmental Impact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trees equivalent:</span>
                      <span className="font-semibold">{Math.floor((stats?.total_co2_saved || 0) * 0.4)} trees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Car miles avoided:</span>
                      <span className="font-semibold">{Math.floor((stats?.total_co2_saved || 0) * 5)} miles</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Home energy saved:</span>
                      <span className="font-semibold">{Math.floor((stats?.total_co2_saved || 0) * 2)} hours</span>
                    </div>
                  </div>
                </div>

                {/* Achievement Level */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Achievement Level</h4>
                  <div className={`p-4 rounded-lg ${achievement.color}/20 border ${achievement.color}/30`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-eco-green" />
                      <span className="font-semibold text-foreground">{achievement.level}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;