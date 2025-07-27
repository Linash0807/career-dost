import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';
import { CareerPath } from '../components/CareerPath';
import { DailyTracker } from '../components/DailyTracker';
import { ContestCalendar } from '../components/ContestCalendar';
import { UserStatsPanel } from '../components/UserStatsPanel';

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
      case 'progress':
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="container mx-auto px-4 py-6 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Progress Heatmap
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">Coming soon - GitHub-style contribution heatmap</p>
                  <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
                    {Array.from({ length: 49 }, (_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
                        style={{ animationDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
          <div className="container mx-auto px-4 py-6 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Learning Resources
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">Coming soon - Curated learning resources hub</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    {['Courses', 'Books', 'Tutorials'].map((category, index) => (
                      <div
                        key={category}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{category[0]}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                        <p className="text-sm text-gray-600">Curated {category.toLowerCase()} for your learning journey</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
          <div className="container mx-auto px-4 py-6 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    Community Forum
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">Coming soon - Student discussion forum</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl">💬</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Discussion Topics</h3>
                      <p className="text-sm text-gray-600">Share knowledge and ask questions</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl">👥</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Peer Networking</h3>
                      <p className="text-sm text-gray-600">Connect with fellow students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default Index;
