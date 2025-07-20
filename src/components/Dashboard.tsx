import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckSquare, 
  Calendar, 
  Trophy,
  TrendingUp,
  Clock,
  Star,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const stats = [
    { label: 'Tasks Completed Today', value: '8/12', percentage: 67, color: 'bg-gradient-success' },
    { label: 'Current Streak', value: '15 days', icon: Trophy, color: 'bg-gradient-primary' },
    { label: 'Career Progress', value: '65%', percentage: 65, color: 'bg-gradient-secondary' },
    { label: 'Upcoming Contests', value: '3', icon: Calendar, color: 'bg-warning' },
  ];

  const recentTasks = [
    { title: 'Complete DSA practice - Arrays', completed: true, category: 'DSA' },
    { title: 'Read React documentation', completed: true, category: 'Learning' },
    { title: 'Submit assignment', completed: false, category: 'Academic' },
    { title: 'LeetCode daily challenge', completed: false, category: 'DSA' },
  ];

  const upcomingContests = [
    { name: 'Codeforces Round #912', date: 'Today, 8:00 PM', platform: 'Codeforces' },
    { name: 'LeetCode Weekly Contest', date: 'Tomorrow, 2:30 PM', platform: 'LeetCode' },
    { name: 'CodeChef START', date: 'Dec 25, 9:00 PM', platform: 'CodeChef' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-primary">Student!</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Let's make today productive and move closer to your career goals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon ? (
                  <stat.icon className="w-5 h-5 text-white" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            {stat.percentage && (
              <Progress value={stat.percentage} className="h-2" />
            )}
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => onNavigate('tasks')}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-accent"
          >
            <CheckSquare className="w-6 h-6 text-primary" />
            <span className="text-sm">Add Task</span>
          </Button>
          <Button
            onClick={() => onNavigate('career')}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-accent"
          >
            <Target className="w-6 h-6 text-primary" />
            <span className="text-sm">Career Path</span>
          </Button>
          <Button
            onClick={() => onNavigate('contests')}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-accent"
          >
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-sm">View Contests</span>
          </Button>
          <Button
            onClick={() => onNavigate('resources')}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-accent"
          >
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-sm">Resources</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-primary" />
              Today's Tasks
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('tasks')}
              className="text-primary hover:bg-accent"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    task.completed 
                      ? 'bg-success border-success' 
                      : 'border-muted-foreground'
                  }`}>
                    {task.completed && <div className="w-full h-full rounded-full bg-success" />}
                  </div>
                  <div>
                    <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    <span className="text-xs text-muted-foreground">{task.category}</span>
                  </div>
                </div>
                {task.completed && <Star className="w-4 h-4 text-warning fill-warning" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Contests */}
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Contests
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('contests')}
              className="text-primary hover:bg-accent"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingContests.map((contest, index) => (
              <div key={index} className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{contest.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{contest.date}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {contest.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};