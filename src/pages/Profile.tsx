import React from 'react';
import { Flame, Target, Calendar, TrendingUp, Share, Download, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatsCard } from '@/components/dashboard/StatsCard';

const recentActivity = [
  {
    date: 'Sep 17, 2025',
    habit: 'Cycle to work',
    co2Saved: '2.3kg CO₂',
    category: 'transport',
  },
  {
    date: 'Sep 17, 2025',
    habit: 'Plant-based meal',
    co2Saved: '1.6kg CO₂',
    category: 'food',
  },
  {
    date: 'Sep 17, 2025',
    habit: 'Reusable water bottle',
    co2Saved: '0.2kg CO₂',
    category: 'waste',
  },
  {
    date: 'Sep 17, 2025',
    habit: 'Shorter shower',
    co2Saved: '0.7kg CO₂',
    category: 'water',
  },
  {
    date: 'Sep 17, 2025',
    habit: 'Turn off devices',
    co2Saved: '0.5kg CO₂',
    category: 'energy',
  },
];

const achievements = [
  {
    title: 'Eco Enthusiast',
    description: 'Keep logging habits to reach the next level!',
    level: 'Current Level',
    progress: 70,
  },
  {
    title: 'First Steps Champion',
    description: 'Completed your first sustainable action',
    earned: true,
  },
  {
    title: 'Weekly Warrior',
    description: 'Logged actions for 7 consecutive days',
    earned: false,
  },
  {
    title: 'CO₂ Saver',
    description: 'Saved over 10kg of CO₂ emissions',
    earned: true,
  },
];

const Profile = () => {
  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              A
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Amisha Bhagat
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Sustainability Champion • 0 badges earned
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Badge variant="outline" className="mb-2 border-eco-yellow text-eco-yellow">
            Overview
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Current Streak"
          value="0 days"
          subtitle="Best: 0"
          icon={Flame}
          iconBg="bg-eco-orange"
        />
        <StatsCard
          title="Total CO₂ Saved"
          value="10.2 kg"
          subtitle="≈ 4 trees planted"
          icon={Target}
          iconBg="bg-primary"
        />
        <StatsCard
          title="This Month"
          value="10.2 kg"
          subtitle="7 actions logged"
          icon={Calendar}
          iconBg="bg-eco-blue"
        />
        <StatsCard
          title="Impact Points"
          value="70"
          subtitle="7 this week"
          icon={TrendingUp}
          iconBg="bg-eco-purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const getCategoryColor = (category: string) => {
                    const colors: { [key: string]: string } = {
                      transport: 'bg-category-transport',
                      food: 'bg-category-food',
                      energy: 'bg-category-energy',
                      water: 'bg-category-water',
                      waste: 'bg-category-waste',
                    };
                    return colors[category] || 'bg-muted';
                  };

                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className={`h-3 w-3 rounded-full ${getCategoryColor(activity.category)}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.habit}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{activity.co2Saved}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? 'bg-primary/10 border-primary/20'
                        : achievement.progress
                        ? 'bg-eco-yellow/10 border-eco-yellow/20'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                      {achievement.earned && (
                        <Badge className="bg-primary text-primary-foreground">✓</Badge>
                      )}
                      {achievement.level && (
                        <Badge variant="outline" className="border-eco-yellow text-eco-yellow">
                          {achievement.level}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    {achievement.progress && (
                      <div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div
                            className="bg-eco-yellow h-2 rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress}% to next level
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌱 Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Environmental Impact</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trees equivalent:</span>
                    <span className="font-semibold text-primary">4 trees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Car miles avoided:</span>
                    <span className="font-semibold text-primary">25 miles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Home energy saved:</span>
                    <span className="font-semibold text-primary">20 hours</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-eco-blue/10">
                <h4 className="font-semibold text-foreground mb-2">Achievement Level</h4>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-eco-blue" />
                  <span className="text-sm font-medium">Eco Enthusiast</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep logging habits to reach the next level!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Weekly Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl mb-3">🚴</div>
                <h4 className="font-semibold text-foreground mb-2">
                  Eco Commuter Challenge
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Use sustainable transport 5 times this week
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '20%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  1 of 5 completed
                </p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Challenge Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📱 Share Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Inspire others by sharing your sustainability journey!
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Create Social Card
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report (PDF)
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;