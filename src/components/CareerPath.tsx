import { useState } from 'react';
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

const careerPaths = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Full-stack development with modern technologies',
    icon: Code,
    color: 'bg-gradient-primary',
    progress: 65,
    milestones: [
      { id: 1, title: 'Learn Programming Fundamentals', completed: true, skills: ['Variables', 'Loops', 'Functions'] },
      { id: 2, title: 'Master Data Structures', completed: true, skills: ['Arrays', 'LinkedList', 'Trees', 'Graphs'] },
      { id: 3, title: 'Algorithm Problem Solving', completed: false, skills: ['Sorting', 'Searching', 'DP'] },
      { id: 4, title: 'Web Development Basics', completed: false, skills: ['HTML', 'CSS', 'JavaScript'] },
      { id: 5, title: 'Frontend Framework', completed: false, skills: ['React', 'Vue', 'Angular'] },
      { id: 6, title: 'Backend Development', completed: false, skills: ['Node.js', 'Express', 'APIs'] },
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analytics, ML, and data-driven insights',
    icon: Brain,
    color: 'bg-gradient-secondary',
    progress: 30,
    milestones: [
      { id: 1, title: 'Statistics & Probability', completed: true, skills: ['Descriptive Stats', 'Hypothesis Testing'] },
      { id: 2, title: 'Python for Data Science', completed: false, skills: ['Pandas', 'NumPy', 'Matplotlib'] },
      { id: 3, title: 'Machine Learning Basics', completed: false, skills: ['Regression', 'Classification', 'Clustering'] },
      { id: 4, title: 'Deep Learning', completed: false, skills: ['Neural Networks', 'TensorFlow', 'PyTorch'] },
      { id: 5, title: 'Data Engineering', completed: false, skills: ['SQL', 'Spark', 'Airflow'] },
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Infrastructure, automation, and deployment',
    icon: Laptop,
    color: 'bg-gradient-success',
    progress: 20,
    milestones: [
      { id: 1, title: 'Linux Fundamentals', completed: true, skills: ['Command Line', 'File System', 'Permissions'] },
      { id: 2, title: 'Version Control', completed: false, skills: ['Git', 'GitHub', 'GitLab'] },
      { id: 3, title: 'Containerization', completed: false, skills: ['Docker', 'Kubernetes', 'Orchestration'] },
      { id: 4, title: 'CI/CD Pipelines', completed: false, skills: ['Jenkins', 'GitHub Actions', 'GitLab CI'] },
      { id: 5, title: 'Cloud Platforms', completed: false, skills: ['AWS', 'Azure', 'GCP'] },
    ]
  }
];

export const CareerPath = () => {
  const [selectedPath, setSelectedPath] = useState(careerPaths[0]);
  const [selectedMilestone, setSelectedMilestone] = useState(selectedPath.milestones[0]);

  const toggleSkillCompletion = (milestoneId: number, skillIndex: number) => {
    // This would typically update the backend state
    console.log(`Toggle skill ${skillIndex} in milestone ${milestoneId}`);
  };

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
          const Icon = path.icon;
          return (
            <Card
              key={path.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-glow ${
                selectedPath.id === path.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => {
                setSelectedPath(path);
                setSelectedMilestone(path.milestones[0]);
              }}
            >
              <div className={`w-12 h-12 ${path.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{path.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{path.progress}%</span>
                </div>
                <Progress value={path.progress} className="h-2" />
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
                {selectedPath.title} Roadmap
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
                  key={milestone.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMilestone.id === milestone.id
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
                        selectedMilestone.id === milestone.id ? 'text-primary' : 'text-muted-foreground'
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
                        onClick={() => toggleSkillCompletion(selectedMilestone.id, index)}
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