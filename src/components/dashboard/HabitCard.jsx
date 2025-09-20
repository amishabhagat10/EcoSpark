import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const HabitCard = ({ title, co2Saved, icon, bgColor, onLog }) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group",
      bgColor
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{co2Saved}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLog}
          className="w-full bg-white/80 hover:bg-white border-white/50 text-foreground group-hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Action
        </Button>
      </CardContent>
    </Card>
  );
};