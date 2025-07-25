import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Task['category']>('DSA');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('Medium');
  const [filterCategory, setFilterCategory] = useState<Task['category'] | 'All'>('All');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ tasks: Task[] }>('/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const response = await api.post<{ task: Task }>('/tasks', {
        title: newTaskTitle,
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: new Date().toISOString(),
      });
      setTasks([response.data.task, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
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

  const todayStreak = 15; // This would come from backend or calculated
  const weeklyStats = {
    tasksCompleted: 42,
    avgDaily: 6,
    bestDay: 12,
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Tracker</h1>
        <p className="text-muted-foreground">Stay organized and productive with your daily tasks</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="text-2xl font-bold text-foreground">{completedToday}/{totalTasks}</p>
            </div>
            <Target className="w-8 h-8 text-primary" />
          </div>
          <Progress value={completionPercentage} className="mt-3 h-2" />
        </Card>

        <Card className="p-4 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Current Streak</p>
              <p className="text-2xl font-bold">{todayStreak} days</p>
            </div>
            <Star className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-success text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Weekly Total</p>
              <p className="text-2xl font-bold">{weeklyStats.tasksCompleted}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Daily Average</p>
              <p className="text-2xl font-bold">{weeklyStats.avgDaily}</p>
            </div>
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Task Form */}
        <Card className="p-6 lg:col-span-2">
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

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Best Day This Week</span>
              <span className="text-sm font-medium text-foreground">{weeklyStats.bestDay} tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Most Active Category</span>
              <Badge variant="secondary">DSA</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="text-sm font-medium text-success">{Math.round(completionPercentage)}%</span>
            </div>
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
              className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                task.completed 
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
                  <p className={`text-sm font-medium ${
                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
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
