import { useState } from 'react';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Users, 
  Menu,
  X,
  Home
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, gradient: 'from-blue-500 to-purple-600' },
  { id: 'career', label: 'Career Path', icon: Target, gradient: 'from-green-500 to-emerald-600' },
  { id: 'tasks', label: 'Daily Tracker', icon: CheckSquare, gradient: 'from-orange-500 to-red-600' },
  { id: 'contests', label: 'Contests', icon: Calendar, gradient: 'from-purple-500 to-pink-600' },
  { id: 'resources', label: 'Resources', icon: BookOpen, gradient: 'from-teal-500 to-cyan-600' },
  { id: 'community', label: 'Community', icon: Users, gradient: 'from-rose-500 to-pink-600' },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                CareerComp
              </h1>
              <p className="text-xs text-gray-500 font-medium">BTech Career Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'animate-pulse' : ''}`} />
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping" />
                  )}
                </Button>
              );
            })}
            {isAuthenticated && (
              <div className="ml-4 pl-4 border-l border-gray-200">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                CareerComp
              </h1>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'animate-pulse' : ''}`} />
                    {item.label}
                  </Button>
                );
              })}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-200">
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};