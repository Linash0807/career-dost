interface PlatformStats {
  platform: string;
  rating: number;
  problemsSolved: number;
  rank?: string;
  maxRating?: number;
}
// ...existing code...
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



// Generalized Event interface for contests, custom events, etc.
interface Event {
  id: string;
  name: string;
  platform?: string; // Platform or source (optional for custom events)
  type?: string; // 'contest', 'custom', etc.
  startTime: string;
  endTime: string;
  duration: string;
  status: 'upcoming' | 'running' | 'completed';
  difficulty?: string;
  participants?: number;
  url?: string;
  description?: string;
  reminderSet?: boolean;
}
// ...existing code...

export function ContestCalendar() {

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

  // Use generic events array instead of contests
  const [events, setEvents] = useState<Event[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedPlatform, setSelectedPlatform] = useState<string | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'All'>('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Only fetch real-time contest data from all platforms
        await fetchRealTimeContests();
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

  // Only fetch and show contests that are upcoming or running (real-time)
  const fetchRealTimeContests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch events from multiple platforms
      const [leetCodeContests, codeforcesContests, codechefContests] = await Promise.allSettled([
        api.get('/contests/leetcode'),
        api.get('/contests/codeforces'),
        api.get('/contests/codechef')
      ]);

      let allEvents: Event[] = [];

      // LeetCode
      if (leetCodeContests.status === 'fulfilled') {
        const leetCodeData = leetCodeContests.value.data as { success?: boolean; contests?: any[] };
        if (leetCodeData.success && leetCodeData.contests) {
          allEvents = allEvents.concat(
            leetCodeData.contests
              .filter((c: any) => {
                const now = new Date();
                const start = new Date(c.startTime);
                const end = new Date(c.endTime);
                return now <= end;
              })
              .map((c: any) => ({
                id: c.id || `leetcode-${Date.now()}`,
                name: c.name,
                platform: 'LeetCode',
                type: 'contest',
                startTime: c.startTime,
                endTime: c.endTime,
                duration: calculateDuration(c.startTime, c.endTime),
                status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
                difficulty: c.difficulty || 'Intermediate',
                participants: c.participants || 0,
                url: c.url,
                description: c.description,
                reminderSet: false,
              }))
          );
        }
      }
      // Codeforces
      if (codeforcesContests.status === 'fulfilled') {
        const codeforcesData = codeforcesContests.value.data as { success?: boolean; contests?: any[] };
        if (codeforcesData.success && codeforcesData.contests) {
          allEvents = allEvents.concat(
            codeforcesData.contests
              .filter((c: any) => {
                const now = new Date();
                const start = new Date(c.startTime);
                const end = new Date(c.endTime);
                return now <= end;
              })
              .map((c: any) => ({
                id: c.id || `codeforces-${Date.now()}`,
                name: c.name,
                platform: 'Codeforces',
                type: 'contest',
                startTime: c.startTime,
                endTime: c.endTime,
                duration: calculateDuration(c.startTime, c.endTime),
                status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
                difficulty: c.difficulty || 'Intermediate',
                participants: c.participants || 0,
                url: c.url,
                description: c.description,
                reminderSet: false,
              }))
          );
        }
      }
      // CodeChef
      if (codechefContests.status === 'fulfilled') {
        const codechefData = codechefContests.value.data as { success?: boolean; contests?: any[] };
        if (codechefData.success && codechefData.contests) {
          allEvents = allEvents.concat(
            codechefData.contests
              .filter((c: any) => {
                const now = new Date();
                const start = new Date(c.startTime);
                const end = new Date(c.endTime);
                return now <= end;
              })
              .map((c: any) => ({
                id: c.id || `codechef-${Date.now()}`,
                name: c.name,
                platform: 'CodeChef',
                type: 'contest',
                startTime: c.startTime,
                endTime: c.endTime,
                duration: calculateDuration(c.startTime, c.endTime),
                status: calculateStatus(c.startTime, c.endTime) as 'upcoming' | 'running' | 'completed',
                difficulty: c.difficulty || 'Intermediate',
                participants: c.participants || 0,
                url: c.url,
                description: c.description,
                reminderSet: false,
              }))
          );
        }
      }
      setEvents(allEvents);
      // Save to database for user
      if (allEvents.length > 0) {
        try {
          await api.post('/contests/save-realtime', { contests: allEvents });
        } catch (error) {
          // Ignore save errors
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch real-time events');
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

  // Toggle reminder for an event
  const toggleReminder = (eventId: string) => {
    try {
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, reminderSet: !e.reminderSet } : e
      ));
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  // Helper: format date/time for display and flags
  const formatDateTime = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const now = new Date();
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isToday = dateObj.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();
    const isUpcoming = dateObj > now;
    return { date, time, isToday, isTomorrow, isUpcoming };
  };

  // Helper: get relative time string
  const getRelativeTime = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return '';
  };

  // Filter events by platform and difficulty
  const filteredEvents = events.filter(e => {
    const platformMatch = selectedPlatform === 'All' || e.platform === selectedPlatform;
    const difficultyMatch = selectedDifficulty === 'All' || e.difficulty === selectedDifficulty;
    return platformMatch && difficultyMatch;
  });

  // ...existing JSX code...

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Today's Events</p>
              <p className="text-2xl font-bold">
                {events.filter(e => formatDateTime(e.startTime).isToday).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">This Week</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Reminders Set</p>
              <p className="text-2xl font-bold">
                {events.filter(e => e.reminderSet).length}
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
                {events.reduce((sum, e) => sum + (e.participants || 0), 0).toLocaleString()}
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
                onChange={(e) => setSelectedPlatform(e.target.value as Event['platform'] | 'All')}
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
              onChange={(e) => setSelectedDifficulty(e.target.value as Event['difficulty'] | 'All')}
              className="p-2 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap">
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
          {filteredEvents.map((event) => {
            const { date, time, isToday, isTomorrow, isUpcoming } = formatDateTime(event.startTime);
            return (
              <Card key={event.id} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                        {event.reminderSet && (
                          <Bell className="w-5 h-5 text-purple-600 fill-purple-600" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {event.platform && (
                          <Badge className={`text-white ${platformColors[event.platform] || 'bg-gray-500'}`}>{event.platform}</Badge>
                        )}
                        {event.difficulty && (
                          <Badge className={`text-white ${difficultyColors[event.difficulty] || 'bg-gray-500'}`}>{event.difficulty}</Badge>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.duration}
                        </div>
                        {event.participants && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            {event.participants.toLocaleString()}
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
                            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : getRelativeTime(event.startTime)}
                          </Badge>
                        </div>
                        {event.description && (
                          <div className="mt-2 text-sm text-gray-600">{event.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReminder(event.id)}
                        className={`${
                          event.reminderSet 
                            ? 'border-purple-500 text-purple-600 hover:bg-purple-50' 
                            : 'hover:border-purple-500 hover:text-purple-600'
                        } transition-all duration-200`}
                      >
                        <Bell className={`w-4 h-4 mr-2 ${event.reminderSet ? 'fill-purple-600' : ''}`} />
                        {event.reminderSet ? 'Reminded' : 'Remind Me'}
                      </Button>
                      {event.url && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(event.url, '_blank')}
                          className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Event
                        </Button>
                      )}
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
}
