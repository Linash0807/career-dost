import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  Code, 
  Database, 
  Brain, 
  Laptop,
  ChevronRight,
  Plus,
  Award
} from 'lucide-react';
import { api } from '@/lib/api';

export const CareerPath = () => {
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<any | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/career-path');
        console.log('Career paths API response:', response);
        const paths = response.data as { careerPaths: any[] };
        setCareerPaths(paths.careerPaths);
        if (paths.careerPaths.length > 0) {
          setSelectedPath(paths.careerPaths[0]);
          setSelectedMilestone(paths.careerPaths[0].milestones && paths.careerPaths[0].milestones.length > 0 ? paths.careerPaths[0].milestones[0] : null);
        }
      } catch (error) {
        console.error('Failed to fetch career paths:', error);
        setError('Failed to load career paths. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCareerPaths();
  }, []);

  const toggleSkillCompletion = async (milestoneId, skillIndex) => {
    if (!selectedPath) return;
    try {
      // Toggle skill completion locally
      const updatedMilestones = selectedPath.milestones.map(milestone => {
        if (milestone._id === milestoneId) {
          // Toggle completion of the milestone itself
          const updatedCompleted = !milestone.completed;
          return { ...milestone, completed: updatedCompleted };
        }
        return milestone;
      });

      // Calculate new progress as percentage of completed milestones
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);

      // Prepare update payload
      const updatedCareerPath = {
        milestones: updatedMilestones,
        progress,
      };

      // Send update to backend
      const response = await api.put<{ careerPath: any }>(`/career-path/${selectedPath._id}`, updatedCareerPath);
      const updatedPath = response.data.careerPath;

      // Update state
      setCareerPaths(careerPaths.map(cp => cp._id === updatedPath._id ? updatedPath : cp));
      setSelectedPath(updatedPath);
      setSelectedMilestone(updatedPath.milestones.find(m => m._id === milestoneId) || null);
    } catch (error) {
      console.error('Failed to update milestone completion:', error);
    }
  };

  if (loading) {
    return <div>Loading career paths...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!selectedPath) {
    return <div>No career paths available.</div>;
  }

  const completedMilestones = selectedPath.milestones.filter(m => m.completed).length;
  const totalMilestones = selectedPath.milestones.length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Career Path Planner</h1>
        <p className="text-muted-foreground">Choose your path and track your progress towards your dream career</p>
      </div>

      {/* Career Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {careerPaths.map((path) => {
          const Icon = path.icon || Code; // fallback icon
          return (
            <Card
              key={path._id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-glow ${
                selectedPath._id === path._id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => {
                setSelectedPath(path);
                setSelectedMilestone(path.milestones[0]);
              }}
            >
              <div className={`w-12 h-12 ${path.color || 'bg-gradient-primary'} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{path.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{path.progress || 0}%</span>
                </div>
                <Progress value={path.progress || 0} className="h-2" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Path Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestones Timeline */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                {selectedPath.name} Roadmap
              </h2>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {completedMilestones}/{totalMilestones} completed
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedPath.milestones.map((milestone, index) => (
                <div
                  key={milestone._id || milestone.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMilestone._id === milestone._id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {milestone.completed ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        milestone.completed ? 'text-success' : 'text-foreground'
                      }`}>
                        {milestone.title}
                      </h3>
                      <ChevronRight className={`w-4 h-4 ${
                        selectedMilestone._id === milestone._id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {milestone.skills.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {milestone.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{milestone.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Milestone Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {selectedMilestone.title}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={selectedMilestone.completed ? "default" : "secondary"}>
                  {selectedMilestone.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Skills to Learn</span>
                <div className="space-y-2">
                  {selectedMilestone.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <span className="text-sm text-foreground">{skill}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSkillCompletion(selectedMilestone._id || selectedMilestone.id, index)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="w-4 h-4 text-muted-foreground hover:text-success" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Milestone
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Set Learning Goal
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Find Resources
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
