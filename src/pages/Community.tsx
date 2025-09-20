import React from 'react';
import { Crown, Users, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatsCard } from '@/components/dashboard/StatsCard';

const leaderboardData = [
  {
    rank: 1,
    name: 'Amisha',
    co2Saved: '10.2 kg',
    badge: '👑',
    level: 'Sustainability Champion',
  },
  {
    rank: 2,
    name: 'Alex Chen',
    co2Saved: '8.7 kg',
    badge: '🥈',
    level: 'Eco Warrior',
  },
  {
    rank: 3,
    name: 'Sarah Johnson',
    co2Saved: '7.9 kg',
    badge: '🥉',
    level: 'Green Guardian',
  },
  {
    rank: 4,
    name: 'Marcus Rodriguez',
    co2Saved: '6.2 kg',
    badge: '🌱',
    level: 'Eco Enthusiast',
  },
  {
    rank: 5,
    name: 'Emma Williams',
    co2Saved: '5.8 kg',
    badge: '♻️',
    level: 'Sustainability Starter',
  },
];

const Community = () => {
  const [selectedFilter, setSelectedFilter] = React.useState('All Time');

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-eco-purple">
              <Users className="h-6 w-6 text-white" />
            </div>
            Community Impact
          </h1>
          <p className="text-lg text-muted-foreground">
            Together we're making a difference! See how your sustainability efforts contribute to our collective environmental impact.
          </p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Members"
          value="1"
          subtitle="1 active this week"
          icon={Users}
          iconBg="bg-eco-blue"
        />
        <StatsCard
          title="Collective CO₂ Saved"
          value="10.2 kg"
          subtitle="≈ 4 trees planted"
          icon={Target}
          iconBg="bg-primary"
        />
        <StatsCard
          title="Total Actions"
          value="7"
          subtitle="10.2 kg this week"
          icon={Zap}
          iconBg="bg-eco-purple"
        />
        <StatsCard
          title="Community Impact"
          value="25 miles"
          subtitle="of travel emissions avoided"
          icon={Crown}
          iconBg="bg-eco-orange"
        />
      </div>

      {/* Community Impact Card */}
      <Card className="mb-8 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Community Impact</h2>
          </div>
          <p className="text-lg mb-4">Great start! Every action counts 🌱</p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>20 hours of home energy saved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>Equivalent to 4 trees planted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Leaderboard
              </h2>
              <div className="flex gap-2">
                {['All Time', 'This Month', 'This Week'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={selectedFilter === filter ? 'bg-primary' : ''}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-eco-yellow" />
                Top Eco Warriors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      user.rank === 1
                        ? 'bg-eco-yellow/10 border border-eco-yellow/20'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-muted font-bold text-sm">
                      {user.rank}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-lg">{user.badge}</span>
                        {user.rank === 1 && (
                          <Badge variant="outline" className="text-xs border-eco-yellow text-eco-yellow">
                            Champion
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.level}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-foreground">{user.co2Saved}</p>
                      <p className="text-sm text-muted-foreground">CO₂ Saved (total)</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Badges */}
        <div className="space-y-6">
          {/* Top Contributor Highlight */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 This Week's Champion</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarFallback className="bg-eco-yellow text-white text-2xl font-bold">
                    A
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">Amisha Bhagat</h3>
                <p className="text-sm text-muted-foreground">Sustainability Champion</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">10.2 kg</p>
                  <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-eco-purple">70</p>
                  <p className="text-xs text-muted-foreground">Impact Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collective Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Community Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Monthly Target</span>
                  <span className="text-xs text-primary">34%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '34%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  10.2 kg of 30 kg target
                </p>
              </div>

              <div className="p-3 rounded-lg bg-eco-blue/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Tree Equivalent</span>
                  <span className="text-xs text-eco-blue">4/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-eco-blue h-2 rounded-full" 
                    style={{ width: '40%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  4 trees planted equivalent
                </p>
              </div>

              <div className="text-center pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Challenges
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Community Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌱 Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">
                    <strong>Amisha</strong> logged cycling to work
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-purple"></div>
                  <span className="text-muted-foreground">
                    <strong>Amisha</strong> earned Champion badge
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-eco-blue"></div>
                  <span className="text-muted-foreground">
                    Community reached 4 trees planted!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;