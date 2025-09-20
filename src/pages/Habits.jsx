import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';

const categories = ['All', 'Transport', 'Food', 'Energy', 'Water', 'Waste', 'Other'];

const getCategoryColor = (category) => {
  const colors = {
    transport: 'bg-category-transport text-white',
    food: 'bg-category-food text-white',
    energy: 'bg-category-energy text-foreground',
    water: 'bg-category-water text-white',
    waste: 'bg-category-waste text-white',
    other: 'bg-category-other text-white',
  };
  return colors[category] || colors.other;
};

const getCategoryBgColor = (category) => {
  const colors = {
    transport: 'bg-category-transport/10 border-category-transport/20',
    food: 'bg-category-food/10 border-category-food/20',
    energy: 'bg-category-energy/10 border-category-energy/20',
    water: 'bg-category-water/10 border-category-water/20',
    waste: 'bg-category-waste/10 border-category-waste/20',
    other: 'bg-category-other/10 border-category-other/20',
  };
  return colors[category] || colors.other;
};

const Habits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();
  const { habits, loading, logHabit } = useUserData();

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           habit.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sustainable Habits
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your eco-friendly actions and their environmental impact
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Habit
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-eco-yellow/10 border-eco-yellow/20"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category 
                  ? getCategoryColor(category.toLowerCase())
                  : 'hover:bg-muted'
              }`}
            >
              <Filter className="h-3 w-3 mr-1" />
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredHabits.length} of {habits.length} habits
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => (
          <Card key={habit.id} className={`${getCategoryBgColor(habit.category)} hover:shadow-md transition-all duration-200 group`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl mb-2">{habit.icon}</div>
                <Badge className={getCategoryColor(habit.category)}>
                  {habit.category}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {habit.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {habit.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">CO₂ Impact</p>
                  <p className="font-semibold text-foreground">{habit.co2_impact}kg per action</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLogHabit(habit)}
                className="w-full bg-white/80 hover:bg-white border-white/50 text-foreground group-hover:scale-105 transition-transform"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Action
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredHabits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No habits found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('All');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Habits;