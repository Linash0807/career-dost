import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { CareerPath } from '@/components/CareerPath';
import { DailyTracker } from '@/components/DailyTracker';
import { ContestCalendar } from '@/components/ContestCalendar';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'career':
        return <CareerPath />;
      case 'tasks':
        return <DailyTracker />;
      case 'contests':
        return <ContestCalendar />;
      case 'progress':
        return (
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Progress Heatmap</h1>
            <p className="text-muted-foreground">Coming soon - GitHub-style contribution heatmap</p>
          </div>
        );
      case 'resources':
        return (
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Learning Resources</h1>
            <p className="text-muted-foreground">Coming soon - Curated learning resources hub</p>
          </div>
        );
      case 'community':
        return (
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Community Forum</h1>
            <p className="text-muted-foreground">Coming soon - Student discussion forum</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
