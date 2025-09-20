import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconBg,
  iconColor = "text-white"
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {value}
            </p>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            iconBg
          )}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};