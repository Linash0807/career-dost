import React, { useEffect, useState } from 'react';

const calculateCurrentStreak = (tasks) => {
  const completedDates = new Set(
    tasks.filter(t => t.completed && t.updatedAt).map(t => t.updatedAt.slice(0, 10))
  );
  let streak = 0;
  let currentDate = new Date();
  while (true) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};
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
  BookOpen,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  category: string;
  updatedAt?: string;
  dueDate?: string;
  createdAt?: string;
}

interface Contest {
  _id: string;
  name: string;
  date: string;
  platform: string;
}

interface CareerPath {
  _id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  progress: number; // percentage
  milestones: any[];
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats, setStats] = useState([
    { label: 'Tasks Completed Today', value: '0/0', percentage: 0, color: 'bg-gradient-success' },
    { label: 'Current Streak', value: '0 days', icon: Trophy, color: 'bg-gradient-primary' },
    { label: 'Career Progress', value: '0%', percentage: 0, color: 'bg-gradient-secondary' },
    { label: 'Upcoming Contests', value: '0', icon: Calendar, color: 'bg-warning' },
  ]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Move fetchDashboardData outside useEffect for reuse
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch tasks
      const tasksResponse = await api.get<{ tasks: Task[] }>('/tasks');
      const tasks = tasksResponse.data.tasks;

      // Show all today's tasks, not just recent
      const today = new Date().toISOString().slice(0, 10);
      const todaysTasksList = tasks.filter(task => {
        // Use dueDate if available, else fallback to createdAt
        const dateStr = (task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt)).toISOString().slice(0, 10);
        return dateStr === today;
      });
      const tasksCompletedToday = todaysTasksList.filter(task => task.completed);
      // Fetch contests
      const contestsResponse = await api.get<{ contests: Contest[] }>('/contests');
      const contests = contestsResponse.data.contests;
      const upcomingContestsList = contests.slice(0, 3);

      // Fetch career paths
      const careerResponse = await api.get<{ careerPaths: CareerPath[] }>('/career-path');
      const careerPaths = careerResponse.data.careerPaths;
      // Calculate overall career progress as average of all career paths progress
      const careerProgress = careerPaths.length > 0
        ? Math.round(careerPaths.reduce((acc, cp) => acc + cp.progress, 0) / careerPaths.length)
        : 0;

      setCareerPaths(careerPaths);

      // Calculate current streak
      const currentStreak = calculateCurrentStreak(tasks);

      // Update stats
      setStats([
        {
          label: 'Tasks Completed Today',
          value: `${tasksCompletedToday.length}/${todaysTasksList.length}`,
          percentage: todaysTasksList.length > 0 ? (tasksCompletedToday.length / todaysTasksList.length) * 100 : 0,
          color: 'bg-gradient-success',
        },
        {
          label: 'Current Streak',
          value: `${currentStreak} days`,
          icon: Trophy,
          color: 'bg-gradient-primary',
        },
        {
          label: 'Career Progress',
          value: `${careerProgress}%`,
          percentage: careerProgress,
          color: 'bg-gradient-secondary',
        },
        {
          label: 'Upcoming Contests',
          value: `${upcomingContestsList.length}`,
          icon: Calendar,
          color: 'bg-warning',
        },
      ]);

      setRecentTasks(todaysTasksList);
      setUpcomingContests(upcomingContestsList);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  // Toggle task completion status
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const updatedTask = await api.put<{ task: Task }>(`/tasks/${task._id}`, { completed: !task.completed });
      setRecentTasks(prevTasks =>
        prevTasks.map(t => (t._id === task._id ? updatedTask.data.task : t))
      );
      // Also refresh stats after toggling
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update task completion', err);
    }
  };

  // Add deleteTask function
  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

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

      {/* Career Paths Overview */}
      <Card className="p-6 bg-gradient-card shadow-card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Your Career Paths
          </h2>
          <Button
            onClick={() => onNavigate('career')}
            variant="outline"
            className="flex items-center gap-2"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {careerPaths && careerPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPaths.slice(0, 3).map((path) => (
              <Card key={path._id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('career')}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{path.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{path.name}</h3>
                    <p className="text-xs text-muted-foreground">{path.difficulty}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {path.milestones?.filter(m => m.completed).length || 0} of {path.milestones?.length || 0} milestones
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Career Paths Yet</h3>
            <p className="text-muted-foreground mb-4">Start your career journey by choosing a path</p>
            <Button onClick={() => onNavigate('career')} className="bg-gradient-primary">
              Choose Career Path
            </Button>
          </div>
        )}
      </Card>

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
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${task.completed
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTaskCompletion(task)}
                    className="p-0 h-auto"
                  >
                    {task.completed ? (
                      <Star className="w-4 h-4 text-warning fill-warning" />
                    ) : (
                      <CheckSquare className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
            {upcomingContests.map((contest) => (
              <div key={contest._id} className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all">
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
