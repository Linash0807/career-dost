import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Award,
  Clock,
  BookOpen,
  ExternalLink,
  Star
} from 'lucide-react';
import { api } from '@/lib/api';

interface Milestone {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  skills: string[];
  resources: string[];
  estimatedTime: string;
}

interface CareerPath {
  _id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  progress: number;
  milestones: Milestone[];
}

export const CareerPath = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [templates, setTemplates] = useState<CareerPath[]>([]);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  // ...existing code...
  // State for delete loading
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Delete career path handler
  const handleDeletePath = async (pathId: string) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    setDeleteLoadingId(pathId);
    try {
      await api.delete(`/career-path/${pathId}`);
      // Refresh user career paths
      const response = await api.get<{ careerPaths: CareerPath[] }>('/career-path');
      const paths = response.data.careerPaths;
      setCareerPaths(paths);
      // Select first path if any remain
      if (paths.length > 0) {
        setSelectedPath(paths[0]);
      } else {
        setSelectedPath(null);
      }
    } catch (err) {
      setError('Failed to delete career path.');
    } finally {
      setDeleteLoadingId(null);
    }
  };
  // State for Add Roadmap modal
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<{ careerPaths: CareerPath[] }>('/career-path');
        const paths = response.data.careerPaths;
        setCareerPaths(paths);
        if (paths.length > 0) {
          setSelectedPath(paths[0]);
        }
        // Always fetch templates
        setTemplateLoading(true);
        try {
          const templateRes = await api.get<{ templates: CareerPath[] }>('/career-path/templates');
          setTemplates(templateRes.data.templates);
        } catch (err) {
          setError('Failed to load career path templates.');
        } finally {
          setTemplateLoading(false);
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

  const toggleMilestoneCompletion = async (milestoneId: string) => {
    if (!selectedPath) return;

    try {
      const updatedMilestones = selectedPath.milestones.map(milestone => {
        if (milestone._id === milestoneId) {
          return { ...milestone, completed: !milestone.completed };
        }
        return milestone;
      });

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);

      const updatedCareerPath = {
        milestones: updatedMilestones,
        progress,
      };

      const response = await api.put<{ careerPath: CareerPath }>(`/career-path/${selectedPath._id}`, updatedCareerPath);
      const updatedPath = response.data.careerPath;

      setCareerPaths(careerPaths.map(cp => cp._id === updatedPath._id ? updatedPath : cp));
      setSelectedPath(updatedPath);
    } catch (error) {
      console.error('Failed to update milestone completion:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading career paths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Always show templates with Add button, even if user has career paths
  const handleAddTemplate = async (templateId: string) => {
    try {
      setTemplateLoading(true);
      await api.post(`/career-path/clone`, { templateId });
      // Refresh user career paths
      const response = await api.get<{ careerPaths: CareerPath[] }>('/career-path');
      const paths = response.data.careerPaths;
      setCareerPaths(paths);
      // Select the newly added path (assume last in array)
      if (paths.length > 0) {
        setSelectedPath(paths[paths.length - 1]);
        // Optionally scroll to sidebar
        setTimeout(() => {
          const sidebar = document.querySelector('.lg\\:col-span-1');
          if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (err) {
      setError('Failed to add career path.');
    } finally {
      setTemplateLoading(false);
    }
  };

  const completedMilestones = selectedPath ? selectedPath.milestones.filter(m => m.completed).length : 0;
  const totalMilestones = selectedPath ? selectedPath.milestones.length : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Career Paths</h1>
        <p className="text-muted-foreground">Choose your career path and track your progress</p>
      </div>

      {/* If no career paths, show all templates with Add button and empty state */}
      {careerPaths.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-2xl font-bold mb-4">No career paths found</h2>
          <p className="text-muted-foreground mb-8">Add a roadmap to get started!</p>
          <div className="w-full max-w-4xl">
            {templateLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template._id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {template.estimatedDuration}
                        </div>
                      </div>
                      <Button onClick={() => handleAddTemplate(template._id)} className="mt-2">
                        <Plus className="mr-2" /> Add Path
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Career Paths Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {careerPaths.map((path) => (
                  <div
                    key={path._id}
                    className={`relative p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${selectedPath?._id === path._id ? 'bg-accent border-2 border-primary' : 'border border-border'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div className="flex-1 min-w-0" onClick={() => setSelectedPath(path)}>
                        <h3 className="font-semibold text-sm truncate">{path.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getDifficultyColor(path.difficulty)}`}>{path.difficulty}</Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {path.estimatedDuration}
                          </div>
                        </div>
                      </div>
                      {/* Delete button */}
                      <button
                        className="ml-2 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded transition-all border border-red-200 bg-red-50"
                        disabled={deleteLoadingId === path._id}
                        onClick={() => handleDeletePath(path._id)}
                        title="Delete roadmap"
                      >
                        {deleteLoadingId === path._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <div className="mt-2">
                      <Progress value={path.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{path.progress}% complete</p>
                    </div>
                  </div>
                ))}
                {/* Add Another Roadmap button if user has at least one path */}
                {careerPaths.length > 0 && (
                  <div className="mt-6 text-center">
                    <Button onClick={() => setShowAddModal(true)} variant="outline">
                      <Plus className="mr-2" /> Add Another Roadmap
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Career Path Details */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedPath.icon}</span>
                    <div>
                      <CardTitle className="text-2xl">{selectedPath.name}</CardTitle>
                      <CardDescription className="text-base mt-1">{selectedPath.description}</CardDescription>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge className={getDifficultyColor(selectedPath.difficulty)}>{selectedPath.difficulty}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedPath.estimatedDuration}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Award className="w-4 h-4 mr-1" />
                          {completedMilestones}/{totalMilestones} milestones
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Tabs for overview and milestones */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      {selectedPath.milestones.map((milestone, index) => (
                        <Card key={milestone._id || index} className="border border-border">
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <Circle className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-base">{index + 1}. {milestone.title}</h4>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-2">{milestone.description}</p>
                            <div className="flex flex-wrap gap-3 mb-2">
                              <span className="text-xs font-semibold">Skills:</span>
                              {milestone.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-xs">Estimated time: {milestone.estimatedTime || 'N/A'}</span>
                            </div>
                            <div className="mb-2">
                              <span className="text-xs font-semibold">Recommended Resources:</span>
                              <ul className="list-disc ml-6 mt-1">
                                {milestone.resources.map((resource, resourceIndex) => (
                                  <li key={resourceIndex} className="text-xs text-muted-foreground">
                                    <a href={resource} target="_blank" rel="noopener noreferrer" className="underline">{resource}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  {/* ...existing code for milestones tab... */}
                  <TabsContent value="milestones" className="mt-6">
                    <div className="space-y-4">
                      {selectedPath.milestones.map((milestone, index) => (
                        <Card key={milestone._id || index} className={`border transition-colors ${milestone.completed ? 'bg-green-50 border-green-200' : 'border-border'}`}>
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="pt-1">
                              <Button
                                variant={milestone.completed ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full w-8 h-8 p-0 ${milestone.completed ? "bg-green-600 hover:bg-green-700" : ""}`}
                                onClick={() => toggleMilestoneCompletion(milestone._id)}
                              >
                                {milestone.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                              </Button>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`font-semibold text-base ${milestone.completed ? 'text-green-800 line-through' : 'text-foreground'}`}>
                                  {milestone.title}
                                </h4>
                                {milestone.completed && <Badge className="bg-green-200 text-green-800 hover:bg-green-300">Completed</Badge>}
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{milestone.description}</p>

                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {milestone.estimatedTime}
                                </span>
                                <span>|</span>
                                <span className="font-medium">Resources: {milestone.resources.length}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal for adding another roadmap */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Another Roadmap</h2>
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Close
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template._id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {template.estimatedDuration}
                      </div>
                    </div>
                    <Button onClick={() => { handleAddTemplate(template._id); setShowAddModal(false); }} className="mt-2">
                      <Plus className="mr-2" /> Add Path
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
