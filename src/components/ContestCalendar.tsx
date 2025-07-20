import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Star
} from 'lucide-react';

interface Contest {
  id: number;
  name: string;
  platform: 'Codeforces' | 'LeetCode' | 'CodeChef' | 'AtCoder' | 'HackerRank';
  startTime: string;
  duration: string;
  status: 'upcoming' | 'running' | 'completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  participants?: number;
  url: string;
  reminderSet?: boolean;
}

const contests: Contest[] = [
  {
    id: 1,
    name: 'Codeforces Round #912 (Div. 2)',
    platform: 'Codeforces',
    startTime: '2024-12-20T20:00:00',
    duration: '2h 15m',
    status: 'upcoming',
    difficulty: 'Intermediate',
    participants: 15420,
    url: 'https://codeforces.com',
    reminderSet: true,
  },
  {
    id: 2,
    name: 'Weekly Contest 375',
    platform: 'LeetCode',
    startTime: '2024-12-21T14:30:00',
    duration: '1h 30m',
    status: 'upcoming',
    difficulty: 'Beginner',
    participants: 8230,
    url: 'https://leetcode.com',
  },
  {
    id: 3,
    name: 'CodeChef Starters 115',
    platform: 'CodeChef',
    startTime: '2024-12-22T21:00:00',
    duration: '3h',
    status: 'upcoming',
    difficulty: 'Advanced',
    participants: 5670,
    url: 'https://codechef.com',
  },
  {
    id: 4,
    name: 'AtCoder Beginner Contest 332',
    platform: 'AtCoder',
    startTime: '2024-12-23T21:00:00',
    duration: '1h 40m',
    status: 'upcoming',
    difficulty: 'Beginner',
    participants: 12340,
    url: 'https://atcoder.jp',
  },
  {
    id: 5,
    name: 'HackerRank World CodeSprint',
    platform: 'HackerRank',
    startTime: '2024-12-24T10:00:00',
    duration: '4h',
    status: 'upcoming',
    difficulty: 'Advanced',
    participants: 3450,
    url: 'https://hackerrank.com',
  },
];

const platformColors = {
  Codeforces: 'bg-red-500',
  LeetCode: 'bg-orange-500',
  CodeChef: 'bg-brown-600',
  AtCoder: 'bg-gray-600',
  HackerRank: 'bg-green-600',
};

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
};

export const ContestCalendar = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedPlatform, setSelectedPlatform] = useState<Contest['platform'] | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Contest['difficulty'] | 'All'>('All');

  const toggleReminder = (contestId: number) => {
    console.log(`Toggle reminder for contest ${contestId}`);
    // This would typically update the backend state
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isToday: date.toDateString() === new Date().toDateString(),
      isTomorrow: date.toDateString() === new Date(Date.now() + 86400000).toDateString(),
    };
  };

  const filteredContests = contests.filter(contest => {
    const platformMatch = selectedPlatform === 'All' || contest.platform === selectedPlatform;
    const difficultyMatch = selectedDifficulty === 'All' || contest.difficulty === selectedDifficulty;
    return platformMatch && difficultyMatch;
  });

  const getRelativeTime = (dateTime: string) => {
    const { isToday, isTomorrow } = formatDateTime(dateTime);
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return formatDateTime(dateTime).date;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contest Calendar</h1>
        <p className="text-muted-foreground">Never miss a coding contest again</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-primary text-white">
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

        <Card className="p-4 bg-gradient-success text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">This Week</p>
              <p className="text-2xl font-bold">{contests.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-secondary text-white">
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

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-bold text-foreground">
                {contests.reduce((sum, c) => sum + (c.participants || 0), 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Contest['platform'] | 'All')}
                className="p-2 border border-border rounded-md bg-background text-foreground text-sm"
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
              className="p-2 border border-border rounded-md bg-background text-foreground text-sm"
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
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
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
            const { time, isToday, isTomorrow } = formatDateTime(contest.startTime);
            return (
              <Card key={contest.id} className="p-6 hover:shadow-glow transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{contest.name}</h3>
                      {contest.reminderSet && (
                        <Bell className="w-4 h-4 text-primary fill-primary" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={`text-white ${platformColors[contest.platform]}`}>
                        {contest.platform}
                      </Badge>
                      <Badge className={`text-white ${difficultyColors[contest.difficulty]}`}>
                        {contest.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {contest.duration}
                      </div>
                      {contest.participants && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {contest.participants.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className={isToday ? 'text-success font-medium' : isTomorrow ? 'text-warning font-medium' : ''}>
                          {getRelativeTime(contest.startTime)}
                        </span>
                        <span className="ml-1">at {time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReminder(contest.id)}
                      className={contest.reminderSet ? 'text-primary border-primary' : ''}
                    >
                      <Bell className={`w-4 h-4 mr-2 ${contest.reminderSet ? 'fill-primary' : ''}`} />
                      {contest.reminderSet ? 'Reminded' : 'Remind Me'}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(contest.url, '_blank')}
                      className="bg-gradient-primary shadow-glow"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Calendar View Placeholder */}
      {viewMode === 'calendar' && (
        <Card className="p-8 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Calendar View</h3>
          <p className="text-muted-foreground mb-4">
            Calendar view will be implemented with a full calendar component showing contests by date
          </p>
          <Button
            variant="outline"
            onClick={() => setViewMode('list')}
          >
            Switch to List View
          </Button>
        </Card>
      )}
    </div>
  );
};