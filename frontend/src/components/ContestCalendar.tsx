import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Bell, 
  Filter,
  Grid,
  List,
  Trophy,
  Users,
  Star,
  Target,
  TrendingUp,
  Code,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

interface Contest {
  id: string;
  name: string;
  platform: 'Codeforces' | 'LeetCode' | 'CodeChef' | 'AtCoder' | 'HackerRank';
  startTime: string;
  endTime: string;
  duration: string;
  status: 'upcoming' | 'running' | 'completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  participants?: number;
  url: string;
  reminderSet?: boolean;
}

interface PlatformStats {
  platform: string;
  rating: number;
  problemsSolved: number;
  rank?: string;
  maxRating?: number;
}

const platformColors = {
  Codeforces: 'bg-blue-500',
  LeetCode: 'bg-orange-500',
  CodeChef: 'bg-green-600',
  AtCoder: 'bg-gray-600',
  HackerRank: 'bg-green-600',
};

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
};

export const ContestCalendar = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedPlatform, setSelectedPlatform] = useState<Contest['platform'] | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Contest['difficulty'] | 'All'>('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // First try to fetch saved contests from database
        console.log('Fetching saved contests...');
        const contestsResponse = await api.get('/contests');
        console.log('Saved contests response:', contestsResponse.data);
        const savedContests = (contestsResponse.data as { contests: any[] }).contests;
        
        if (savedContests && savedContests.length > 0) {
          // Use saved contests
          const contestsData = savedContests.map((c: any) => ({
          id: c._id,
          name: c.name,
          platform: c.platform,
          startTime: c.startTime,
            endTime: c.endTime,
          duration: calculateDuration(c.startTime, c.endTime),
          status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
            difficulty: c.difficulty || 'Intermediate',
          participants: c.participants || 0,
          url: c.url,
          reminderSet: c.reminderSet || false,
        }));
          console.log('Using saved contests:', contestsData.length);
          setContests(contestsData);
        } else {
          // No saved contests, fetch real-time data
          console.log('No saved contests found, fetching real-time data...');
          await fetchRealTimeContests();
        }

        // Fetch platform stats
        const stats = await fetchPlatformStats();
        setPlatformStats(stats);
      } catch (err: any) {
        console.error('Error in initial data fetch:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPlatformStats = async (): Promise<PlatformStats[]> => {
    const stats: PlatformStats[] = [];
    
    try {
      // Fetch LeetCode stats
      const leetCodeResponse = await api.get<{ success: boolean; data?: { rating?: number; problemsSolved?: number } }>('/leetcode/user/hokage08');
      const leetCodeData = leetCodeResponse.data;
      if (leetCodeData.success) {
        stats.push({
          platform: 'LeetCode',
          rating: leetCodeData.data?.rating || 0,
          problemsSolved: leetCodeData.data?.problemsSolved || 0,
        });
      }
    } catch (error) {
      console.log('LeetCode stats not available');
    }

    try {
      // Fetch Codeforces stats
      const codeforcesResponse = await api.get<{ success: boolean; data?: { rating?: number; rank?: string; maxRating?: number } }>('/codeforces/user/linash');
      const codeforcesData = codeforcesResponse.data;
      if (codeforcesData.success) {
        stats.push({
          platform: 'Codeforces',
          rating: codeforcesData.data?.rating || 0,
          problemsSolved: 0, // Codeforces doesn't provide this directly
          rank: codeforcesData.data?.rank,
          maxRating: codeforcesData.data?.maxRating,
        });
      }
    } catch (error) {
      console.log('Codeforces stats not available');
    }

    return stats;
  };

  const fetchRealTimeContests = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching real-time contests from multiple platforms...');
      
      // Fetch contests from multiple platforms
      const [leetCodeContests, codeforcesContests, codechefContests] = await Promise.allSettled([
        api.get('/contests/leetcode'),
        api.get('/contests/codeforces'),
        api.get('/contests/codechef')
      ]);

      const allContests: Contest[] = [];

      // Process LeetCode contests
      if (leetCodeContests.status === 'fulfilled') {
        const leetCodeData = leetCodeContests.value.data as { success?: boolean; contests?: any[] };
        if (leetCodeData.success && leetCodeData.contests) {
          allContests.push(...leetCodeData.contests.map((c: any) => ({
            id: c.id || `leetcode-${Date.now()}`,
            name: c.name,
            platform: 'LeetCode' as const,
            startTime: c.startTime,
            endTime: c.endTime,
            duration: calculateDuration(c.startTime, c.endTime),
            status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
            difficulty: c.difficulty || 'Intermediate',
            participants: c.participants || 0,
            url: c.url,
            reminderSet: false,
          })));
        }
      }

      // Process Codeforces contests
      if (codeforcesContests.status === 'fulfilled') {
        const codeforcesData = codeforcesContests.value.data as { success?: boolean; contests?: any[] };
        if (codeforcesData.success && codeforcesData.contests) {
          allContests.push(...codeforcesData.contests.map((c: any) => ({
            id: c.id || `codeforces-${Date.now()}`,
            name: c.name,
            platform: 'Codeforces' as const,
            startTime: c.startTime,
            endTime: c.endTime,
            duration: calculateDuration(c.startTime, c.endTime),
            status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
            difficulty: c.difficulty || 'Intermediate',
            participants: c.participants || 0,
            url: c.url,
            reminderSet: false,
          })));
        }
      }

      // Process CodeChef contests
      if (codechefContests.status === 'fulfilled') {
        const codechefData = codechefContests.value.data as { success?: boolean; contests?: any[] };
        if (codechefData.success && codechefData.contests) {
          allContests.push(...codechefData.contests.map((c: any) => ({
            id: c.id || `codechef-${Date.now()}`,
            name: c.name,
            platform: 'CodeChef' as const,
            startTime: c.startTime,
            endTime: c.endTime,
            duration: calculateDuration(c.startTime, c.endTime),
            status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
            difficulty: c.difficulty || 'Intermediate',
            participants: c.participants || 0,
            url: c.url,
            reminderSet: false,
          })));
        }
      }

      console.log('Real-time contests fetched:', allContests.length);
      setContests(allContests);
      
      // Save to database for user
      if (allContests.length > 0) {
        try {
          await api.post('/contests/save-realtime', { contests: allContests });
        } catch (error) {
          console.log('Could not save contests to database:', error);
        }
      }
    } catch (error: any) {
      console.error('Error fetching real-time contests:', error);
      setError(error.message || 'Failed to fetch real-time contests');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'running';
    return 'completed';
  };

  const toggleReminder = async (contestId: string) => {
    try {
      await api.put(`/contests/${contestId}/reminder`);
      setContests(contests.map(c => 
        c.id === contestId ? { ...c, reminderSet: !c.reminderSet } : c
      ));
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const contestDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isToday: contestDate.getTime() === today.getTime(),
      isTomorrow: contestDate.getTime() === tomorrow.getTime(),
      isUpcoming: date > now,
    };
  };

  const getRelativeTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    if (diffMs > 0) return 'Starting soon';
    return 'Started';
  };

  const filteredContests = contests.filter(contest => {
    if (selectedPlatform !== 'All' && contest.platform !== selectedPlatform) return false;
    if (selectedDifficulty !== 'All' && contest.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return 'text-red-600';
    if (rating >= 1600) return 'text-orange-600';
    if (rating >= 1200) return 'text-yellow-600';
    if (rating >= 800) return 'text-green-600';
    return 'text-gray-600';
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 2000) return 'bg-red-100 text-red-800';
    if (rating >= 1600) return 'bg-orange-100 text-orange-800';
    if (rating >= 1200) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 800) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contests...</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contest Calendar</h1>
          <p className="text-gray-600">Track upcoming coding contests and your performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              try {
                console.log('Seeding contests...');
                const response = await api.post('/contests/seed');
                console.log('Seed response:', response.data);
                alert('Contests added successfully! Refreshing page...');
                window.location.reload();
              } catch (error) {
                console.error('Error seeding contests:', error);
                alert('Error adding contests: ' + error.message);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            🎯 Add Sample Contests
          </Button>
        </div>
      </div>

      {/* Real-time Contest Data */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Real-time Contest Data</h3>
            <p className="text-blue-700">Fetching live contests from multiple platforms</p>
          </div>
          <Button
            onClick={async () => {
              try {
                console.log('Fetching real-time contests...');
                await fetchRealTimeContests();
              } catch (error) {
                console.error('Error fetching real-time contests:', error);
                alert('Error fetching contests: ' + error.message);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
          >
            🔄 Refresh Contests
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      {platformStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {platformStats.map((stat) => (
            <Card key={stat.platform} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {stat.platform === 'LeetCode' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {stat.platform === 'Codeforces' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-800">{stat.platform}</h3>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <Badge className={getRatingBadgeColor(stat.rating)}>
                      {stat.rating}
                    </Badge>
                  </div>
                  {stat.problemsSolved > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Problems Solved</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-800">{stat.problemsSolved}</span>
                      </div>
                    </div>
                  )}
                  {stat.maxRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Max Rating</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-gray-800">{stat.maxRating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Today's Contests</p>
              <p className="text-2xl font-bold">
                {contests.filter(c => formatDateTime(c.startTime).isToday).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">This Week</p>
              <p className="text-2xl font-bold">{contests.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Reminders Set</p>
              <p className="text-2xl font-bold">
                {contests.filter(c => c.reminderSet).length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-800">
                {contests.reduce((sum, c) => sum + (c.participants || 0), 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Contest['platform'] | 'All')}
                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Platforms</option>
                <option value="Codeforces">Codeforces</option>
                <option value="LeetCode">LeetCode</option>
                <option value="CodeChef">CodeChef</option>
                <option value="AtCoder">AtCoder</option>
                <option value="HackerRank">HackerRank</option>
              </select>
            </div>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Contest['difficulty'] | 'All')}
              className="p-2 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' : ''}
            >
              <Grid className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
      </Card>

      {/* Contest List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredContests.map((contest) => {
            const { date, time, isToday, isTomorrow, isUpcoming } = formatDateTime(contest.startTime);
            return (
              <Card key={contest.id} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{contest.name}</h3>
                      {contest.reminderSet && (
                          <Bell className="w-5 h-5 text-purple-600 fill-purple-600" />
                      )}
                    </div>
                    
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className={`text-white ${platformColors[contest.platform]}`}>
                        {contest.platform}
                      </Badge>
                      <Badge className={`text-white ${difficultyColors[contest.difficulty]}`}>
                        {contest.difficulty}
                      </Badge>
                        <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {contest.duration}
                      </div>
                      {contest.participants && (
                          <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {contest.participants.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                      {/* Enhanced Date and Time Display */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span className="font-medium">{date}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-2" />
                            <span className="font-medium">{time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Badge className={
                            isToday ? 'bg-green-100 text-green-800' :
                            isTomorrow ? 'bg-yellow-100 text-yellow-800' :
                            isUpcoming ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : getRelativeTime(contest.startTime)}
                          </Badge>
                      </div>
                    </div>
                  </div>
                  
                    <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReminder(contest.id)}
                        className={`${
                          contest.reminderSet 
                            ? 'border-purple-500 text-purple-600 hover:bg-purple-50' 
                            : 'hover:border-purple-500 hover:text-purple-600'
                        } transition-all duration-200`}
                    >
                        <Bell className={`w-4 h-4 mr-2 ${contest.reminderSet ? 'fill-purple-600' : ''}`} />
                      {contest.reminderSet ? 'Reminded' : 'Remind Me'}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(contest.url, '_blank')}
                        className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                        Join Contest
                    </Button>
                  </div>
                </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800">Calendar View</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const prevMonth = new Date(currentMonth);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setCurrentMonth(prevMonth);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium text-gray-700">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentMonth(nextMonth);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Calendar View Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                A full calendar view showing contests by date will be implemented soon
          </p>
          <Button
            variant="outline"
            onClick={() => setViewMode('list')}
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            Switch to List View
          </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
