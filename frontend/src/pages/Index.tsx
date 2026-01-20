
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';
import { CommunityChat } from "../components/CommunityChat";
import { FloatingAIAssistant } from "../components/FloatingAIAssistant";
import { CareerPath } from '../components/CareerPath';
import { DailyTracker } from '../components/DailyTracker';
import { ContestCalendar } from '../components/ContestCalendar';
import { UserStatsPanel } from '../components/UserStatsPanel';
import ResourcesPage from './ResourcesPage';
// import ProgressDashboard from './ProgressDashboard';
// import GoalsPage from './GoalsPage';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Get the section from URL params, default to 'dashboard'
    return searchParams.get('section') || 'dashboard';
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Update URL when activeTab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ section: tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Dashboard onNavigate={handleTabChange} />
          </div>
        );
      case 'career':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <CareerPath />
          </div>
        );
      case 'tasks':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <DailyTracker />
          </div>
        );
      case 'contests':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="flex space-x-6 container mx-auto p-4">
              <section className="flex-1">
                <ContestCalendar />
              </section>
              <aside className="w-80">
                <UserStatsPanel leetCodeUsername="exampleLeetCodeUser" codeforcesHandle="exampleCodeforcesUser" />
              </aside>
            </div>
          </div>
        );
      /*case 'progress':
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            <ProgressDashboard />
          </div>
        );*/
      case 'resources':
        return (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
            <ResourcesPage />
          </div>
        );
      /*  case 'goals':
          return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
              <GoalsPage />
            </div>
          );*/
      case 'community':
        return (
          <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
            <CommunityChat />
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Dashboard onNavigate={handleTabChange} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="transition-all duration-300 ease-in-out">
        {renderContent()}
      </main>
      <FloatingAIAssistant />
    </div>
  );
};

export default Index;
