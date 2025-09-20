import React, { useState } from 'react';
import { Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const categoryData = [
  { name: 'Transport', value: 45, color: 'hsl(var(--category-transport))' },
  { name: 'Food', value: 25, color: 'hsl(var(--category-food))' },
  { name: 'Energy', value: 20, color: 'hsl(var(--category-energy))' },
  { name: 'Water', value: 10, color: 'hsl(var(--category-water))' },
];

const weeklyProgress = [
  { week: 'Week 1', co2: 8.2 },
  { week: 'Week 2', co2: 9.1 },
  { week: 'Week 3', co2: 7.8 },
  { week: 'Week 4', co2: 10.2 },
];

const sixMonthTrend = [
  { month: 'Apr', co2: 28.5 },
  { month: 'May', co2: 32.1 },
  { month: 'Jun', co2: 29.8 },
  { month: 'Jul', co2: 35.2 },
  { month: 'Aug', co2: 38.6 },
  { month: 'Sep', co2: 41.3 },
];

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');

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
          {['7 days', '30 days', '90 days'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-eco-yellow text-foreground' : ''}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Last 30 days"
          value="10.2 kg"
          subtitle="≈ 4 trees planted"
          icon={Target}
          iconBg="bg-primary"
        />
        <StatsCard
          title="Actions"
          value="7"
          subtitle="0.2 per day"
          icon={Calendar}
          iconBg="bg-eco-blue"
        />
        <StatsCard
          title="Average"
          value="0.34 kg"
          subtitle="Daily CO₂ Savings"
          icon={TrendingUp}
          iconBg="bg-eco-purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CO2 Savings by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              CO₂ Savings by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-eco-blue"></div>
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
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
            <div className="h-2 w-2 rounded-full bg-eco-purple"></div>
            6-Month Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sixMonthTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="hsl(var(--eco-purple))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--eco-purple))', strokeWidth: 2, r: 6 }}
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
              💡 Personal Impact Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
              <div className="text-xl">🌳</div>
              <div>
                <p className="font-medium text-foreground mb-1">Forest Impact</p>
                <p className="text-sm text-muted-foreground">
                  equivalent to planting 4 trees
                </p>
              </div>
              <div className="text-sm font-semibold text-primary ml-auto">4</div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-eco-blue/10">
              <div className="text-xl">🏠</div>
              <div>
                <p className="font-medium text-foreground mb-1">Energy Saved</p>
                <p className="text-sm text-muted-foreground">
                  hours of home electricity avoided
                </p>
              </div>
              <div className="text-sm font-semibold text-eco-blue ml-auto">20</div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-eco-purple/10">
              <div className="text-xl">🚗</div>
              <div>
                <p className="font-medium text-foreground mb-1">Transport Impact</p>
                <p className="text-sm text-muted-foreground">
                  miles of car travel emissions avoided
                </p>
              </div>
              <div className="text-sm font-semibold text-eco-purple ml-auto">25</div>
            </div>
          </CardContent>
        </Card>

        {/* Future Impact Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔮 Future Impact Projections
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on your current pace of 0.34 kg CO₂ per day
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-eco-blue" />
                <span className="font-medium">1 Month</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">10.3 kg CO₂ saved</p>
                <p className="text-xs text-primary">≈ 4 trees</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-eco-purple" />
                <span className="font-medium">3 Months</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">30.6 kg CO₂ saved</p>
                <p className="text-xs text-primary">≈ 12 trees</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-eco-orange" />
                <span className="font-medium">1 Year</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">124.1 kg CO₂ saved</p>
                <p className="text-xs text-primary">≈ 49 trees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;