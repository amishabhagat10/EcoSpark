import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';



const categories = ['All', 'Transport', 'Food', 'Energy', 'Water', 'Waste', 'Other'];

const habitsData = [
  {
    id: 1,
    title: 'Cycle to work',
    category: 'transport',
    icon: '🚴',
    description: 'Replace car/public transport with cycling for your commute',
    co2Impact: '2.3 kg per trip',
    bgColor: 'bg-category-transport/10 border-category-transport/20',
  },
  {
    id: 2,
    title: 'Eat plant-based meal',
    category: 'food',
    icon: '🥗',
    description: 'Choose a vegetarian or vegan meal instead of meat',
    co2Impact: '1.6 kg per meal',
    bgColor: 'bg-category-food/10 border-category-food/20',
  },
  {
    id: 3,
    title: 'Use reusable water bottle',
    category: 'waste',
    icon: '♻️',
    description: 'Avoid single-use plastic water bottles',
    co2Impact: '0.2 kg per action',
    bgColor: 'bg-category-waste/10 border-category-waste/20',
  },
  {
    id: 4,
    title: 'Turn off devices when not in use',
    category: 'energy',
    icon: '💡',
    description: 'Switch off lights, computers, and electronics to save energy',
    co2Impact: '0.5 kg per action',
    bgColor: 'bg-category-energy/10 border-category-energy/20',
  },
  {
    id: 5,
    title: 'Take shorter shower',
    category: 'water',
    icon: '💧',
    description: 'Reduce shower time by 2-3 minutes to save water and energy',
    co2Impact: '0.7 kg per action',
    bgColor: 'bg-category-water/10 border-category-water/20',
  },
  {
    id: 6,
    title: 'Recycle paper/cardboard',
    category: 'waste',
    icon: '📦',
    description: 'Properly recycle paper and cardboard waste',
    co2Impact: '0.9 kg per kg',
    bgColor: 'bg-category-waste/10 border-category-waste/20',
  },
  {
    id: 7,
    title: 'Walk instead of drive',
    category: 'transport',
    icon: '🚶',
    description: 'Choose walking for short trips under 2km',
    co2Impact: '1.8 kg per trip',
    bgColor: 'bg-category-transport/10 border-category-transport/20',
  },
  {
    id: 8,
    title: 'Use stairs instead of elevator',
    category: 'energy',
    icon: '🏃',
    description: 'Take the stairs to save energy and get exercise',
    co2Impact: '0.3 kg per action',
    bgColor: 'bg-category-energy/10 border-category-energy/20',
  },
  {
    id: 9,
    title: 'Work from home',
    category: 'transport',
    icon: '🏠',
    description: 'Avoid commuting by working remotely',
    co2Impact: '4.5 kg per day',
    bgColor: 'bg-category-transport/10 border-category-transport/20',
  },
  {
    id: 10,
    title: 'Buy local produce',
    category: 'food',
    icon: '🌱',
    description: 'Choose locally grown food to reduce transport emissions',
    co2Impact: '1.2 kg per action',
    bgColor: 'bg-category-food/10 border-category-food/20',
  },
  {
    id: 11,
    title: 'Air dry clothes',
    category: 'energy',
    icon: '👕',
    description: 'Skip the dryer and let clothes air dry naturally',
    co2Impact: '2.3 kg per load',
    bgColor: 'bg-category-energy/10 border-category-energy/20',
  },
  {
    id: 12,
    title: 'Bring reusable shopping bag',
    category: 'waste',
    icon: '🛍️',
    description: 'Use your own bag instead of plastic bags when shopping',
    co2Impact: '0.1 kg per action',
    bgColor: 'bg-category-waste/10 border-category-waste/20',
  },
];

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    transport: 'bg-category-transport text-white',
    food: 'bg-category-food text-white',
    energy: 'bg-category-energy text-foreground',
    water: 'bg-category-water text-white',
    waste: 'bg-category-waste text-white',
    other: 'bg-category-other text-white',
  };
  return colors[category] || colors.other;
};

const Habits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  const filteredHabits = habitsData.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           habit.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleLogHabit = (habit: typeof habitsData[0]) => {
    toast({
      title: "Habit logged! 🌱",
      description: `Great job! You saved ${habit.co2Impact} by ${habit.title.toLowerCase()}.`,
    });
  };

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
          Showing {filteredHabits.length} of {habitsData.length} habits
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => (
          <Card key={habit.id} className={`${habit.bgColor} hover:shadow-md transition-all duration-200 group`}>
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
                  <p className="font-semibold text-foreground">{habit.co2Impact}</p>
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