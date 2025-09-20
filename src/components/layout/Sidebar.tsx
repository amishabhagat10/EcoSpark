import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Users, 
  Target, 
  User,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">EcoTracker</h1>
          <p className="text-sm text-muted-foreground">Sustainability Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Daily Impact Footer */}
      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Leaf className="h-4 w-4" />
            Daily Impact
          </div>
          <p className="text-xs text-muted-foreground">
            Every action counts towards a sustainable future
          </p>
        </div>
      </div>
    </div>
  );
};