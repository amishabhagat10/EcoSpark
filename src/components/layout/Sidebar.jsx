import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Target, User, Leaf, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-background border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">EcoTracker</h1>
          <p className="text-xs text-muted-foreground">Sustainability Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Daily Impact Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Daily Impact</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Every action counts towards a sustainable future! 🌱
          </p>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};