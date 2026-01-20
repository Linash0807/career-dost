import React, { useState, useEffect } from 'react';
import { HeapMap } from './ui/heapmap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  CheckCircle,
  Circle,
  Clock,
  Star,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';

interface Task {
  _id: string;
  title: string;
  category: 'DSA' | 'Projects' | 'Placements' | 'Learning' | 'Academic';
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  dueDate?: string;
  streak?: number;
}

const categoryColors = {
  DSA: 'bg-blue-500',
  Projects: 'bg-green-500',
  Placements: 'bg-purple-500',
  Learning: 'bg-orange-500',
  Academic: 'bg-indigo-500',
};

const priorityColors = {
  Low: 'bg-gray-500',
  Medium: 'bg-yellow-500',
  High: 'bg-red-500',
};

export const DailyTracker = () => {
  // Heatmap range state
  // Heatmap phase: which previous 6 months to show
  const [heatmapPhase, setHeatmapPhase] = useState(0); // 0 = latest, 1 = previous, etc.
  // ...no contest state...
  // ...existing code...
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Task['category']>('DSA');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('Medium');
  const [filterCategory, setFilterCategory] = useState<Task['category'] | 'All'>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Streak stats
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [loginDates, setLoginDates] = useState<string[]>([]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ tasks: Task[] }>('/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Fetch streak stats
    const fetchStreak = async () => {
      try {
        type StreakResponse = { currentStreak: number; maxStreak: number; loginDates: string[] };
        const res = await api.get<StreakResponse>('/auth/streak');
        setCurrentStreak(res.data.currentStreak || 0);
        setMaxStreak(res.data.maxStreak || 0);
        setLoginDates(res.data.loginDates || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchStreak();
  }, []);

  // Fetch contests from backend
  // ...no contest logic...

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const response = await api.post<{ task: Task }>('/tasks', {
        title: newTaskTitle,
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: new Date().toISOString(),
      });
      setTasks([response.data.task, ...tasks]);
      setNewTaskTitle('');
    } catch (error: any) {
      console.error('Failed to add task:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Failed to add task: ${error.response.data.message}`);
      } else {
        setError('Failed to add task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    try {
      const response = await api.put<{ task: Task }>(`/tasks/${id}`, { completed: !task.completed });
      setTasks(tasks.map(t => (t._id === id ? response.data.task : t)));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = filterCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === filterCategory);

  const completedToday = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  // Dynamic streak and stats
  const todayStreak = currentStreak;
  const weeklyStats = {
    tasksCompleted: tasks.filter(t => {
      const date = t.dueDate ? new Date(t.dueDate) : null;
      const now = new Date();
      return t.completed && date && ((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) < 7;
    }).length,
    avgDaily: Math.round(tasks.length / 7),
    bestDay: Math.max(...loginDates.map(d => {
      // Count tasks completed per login date
      const day = new Date(d).toISOString().slice(0, 10);
      return tasks.filter(t => t.completed && t.dueDate && new Date(t.dueDate).toISOString().slice(0, 10) === day).length;
    }), 0),
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Tracker</h1>
        <p className="text-muted-foreground">Stay organized and productive with your daily tasks</p>
      </div>

      {/* Stats & Heatmap Row */}
      <div className="mb-6">
        <Card className="p-6 w-full bg-gradient-card shadow-card">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Heatmap Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Activity Heatmap</h3>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-1.5 rounded text-xs font-medium border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={heatmapPhase}
                    onChange={e => setHeatmapPhase(Number(e.target.value))}
                  >
                    {[0, 1, 2].map(phase => {
                      const now = new Date();
                      let lastMonth = now.getMonth() - 6 * phase;
                      let lastMonthYear = now.getFullYear();
                      if (now.getDate() === 1) {
                        lastMonth--;
                        if (lastMonth < 0) {
                          lastMonth = 11;
                          lastMonthYear--;
                        }
                      }
                      const endDate = new Date(lastMonthYear, lastMonth + 1, 0);
                      const startMonth = lastMonth - 5;
                      let startYear = lastMonthYear;
                      let startMonthAdjusted = startMonth;
                      if (startMonth < 0) {
                        startYear -= 1;
                        startMonthAdjusted = 12 + startMonth;
                      }
                      const startDate = new Date(startYear, startMonthAdjusted, 1);
                      const startLabel = `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`;
                      const endLabel = `${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getFullYear()}`;
                      return (
                        <option key={phase} value={phase}>
                          {startLabel} - {endLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                {(() => {
                  const now = new Date();
                  let end;
                  let lastMonth = now.getMonth();
                  let lastMonthYear = now.getFullYear();
                  if (now.getDate() === 1) {
                    lastMonth--;
                    if (lastMonth < 0) {
                      lastMonth = 11;
                      lastMonthYear--;
                    }
                    end = new Date(lastMonthYear, lastMonth + 1, 0);
                  } else {
                    end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  }
                  const startMonth = end.getMonth() - 5;
                  let startYear = end.getFullYear();
                  let startMonthAdjusted = startMonth;
                  if (startMonth < 0) {
                    startYear -= 1;
                    startMonthAdjusted = 12 + startMonth;
                  }
                  const start = new Date(startYear, startMonthAdjusted, 1);
                  let normalizedLoginDates = loginDates.map(d => {
                    return typeof d === 'string' && d.length === 10 ? d : new Date(d).toISOString().slice(0, 10);
                  });
                  let filteredDates = normalizedLoginDates.filter(d => {
                    const date = new Date(d);
                    return date >= start && date <= end;
                  });
                  const todayStr = now.toISOString().slice(0, 10);
                  if (!filteredDates.includes(todayStr)) {
                    filteredDates = [...filteredDates, todayStr];
                  }
                  const uniqueDates = Array.from(new Set(filteredDates));
                  return <HeapMap loginDates={uniqueDates} daysCount={183} />;
                })()}
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="lg:w-80 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-lg bg-background/50 border border-border/50 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200">
                    <Star className="w-3.5 h-3.5 fill-orange-500" />
                    {todayStreak} Days
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-border/50 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className={`text-sm font-bold ${completionPercentage > 70 ? 'text-green-600' : 'text-blue-600'}`}>
                    {Math.round(completionPercentage)}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Weekly Activity</span>
                    <span className="text-xs font-medium text-foreground">{weeklyStats.tasksCompleted} tasks</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary"
                        style={{ width: `${Math.min(100, (weeklyStats.tasksCompleted / 21) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/50 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Weekly Avg</p>
                    <p className="text-lg font-bold text-foreground">{weeklyStats.avgDaily}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/50 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Best Day</p>
                    <p className="text-lg font-bold text-foreground">{weeklyStats.bestDay}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <Card className="p-6 w-full">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-primary" />
            Add New Task
          </h2>
          <div className="space-y-4">
            <Input
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Task['category'])}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="DSA">DSA</option>
                  <option value="Projects">Projects</option>
                  <option value="Placements">Placements</option>
                  <option value="Learning">Learning</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Task['priority'])}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <Button onClick={addTask} className="w-full bg-gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </Card>
      </div>

      {/* Task List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Today's Tasks</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Task['category'] | 'All')}
              className="p-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="All">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="Projects">Projects</option>
              <option value="Placements">Placements</option>
              <option value="Learning">Learning</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all ${task.completed
                  ? 'bg-success/10 border-success/20'
                  : 'bg-background border-border hover:border-primary/50'
                }`}
            >
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTask(task._id)}
                  className="p-0 h-auto"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  )}
                </Button>

                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs text-white ${categoryColors[task.category]}`}
                    >
                      {task.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs text-white ${priorityColors[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {task.streak && (
                      <div className="flex items-center text-xs text-warning">
                        <Star className="w-3 h-3 mr-1" />
                        {task.streak} day streak
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task._id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
