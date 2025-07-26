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
  BookOpen
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
  progress: number; // percentage
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch tasks
        const tasksResponse = await api.get<{ tasks: Task[] }>('/tasks');
        const tasks = tasksResponse.data.tasks;

        // Calculate tasks completed today and recent tasks (last 4)
        const today = new Date().toISOString().slice(0, 10);
        const tasksCompletedToday = tasks.filter(task => task.completed && task.updatedAt?.slice(0, 10) === today);
        const recentTasksList = tasks.slice(0, 4);

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

        // Calculate current streak
        const currentStreak = calculateCurrentStreak(tasks);

        // Update stats
        setStats([
          {
            label: 'Tasks Completed Today',
            value: `${tasksCompletedToday.length}/${tasks.length}`,
            percentage: tasks.length > 0 ? (tasksCompletedToday.length / tasks.length) * 100 : 0,
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

        setRecentTasks(recentTasksList);
        setUpcomingContests(upcomingContestsList);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

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
      // Optionally refresh stats or other data here
    } catch (err) {
      console.error('Failed to update task completion', err);
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
                onClick={() => toggleTaskCompletion(task)}
              >
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
