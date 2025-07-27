import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Code, 
  Star, 
  Award,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';

interface LeetCodeProfile {
  username: string;
  rating: number;
  problemsSolved: number;
}

interface CodeforcesProfile {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
}

interface UserStatsPanelProps {
  leetCodeUsername: string;
  codeforcesHandle: string;
}

export const UserStatsPanel = ({ leetCodeUsername, codeforcesHandle }: UserStatsPanelProps) => {
  const [leetCodeProfile, setLeetCodeProfile] = useState<LeetCodeProfile | null>(null);
  const [codeforcesProfile, setCodeforcesProfile] = useState<CodeforcesProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const [leetCodeRes, codeforcesRes] = await Promise.all([
          api.get(`/leetcode/user/hokage08`),
          api.get(`/codeforces/user/linash`),
        ]);
        const leetCodeData = leetCodeRes.data as any;
        const codeforcesData = codeforcesRes.data as any;
        setLeetCodeProfile({
          username: leetCodeData.username || leetCodeUsername,
          rating: leetCodeData.rating || 0,
          problemsSolved: leetCodeData.problemsSolved || 0,
        });
        setCodeforcesProfile({
          handle: codeforcesData.handle,
          rating: codeforcesData.rating,
          maxRating: codeforcesData.maxRating,
          rank: codeforcesData.rank,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [leetCodeUsername, codeforcesHandle]);

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
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Account Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading profiles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Account Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span>Failed to load profiles</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          Account Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* LeetCode Stats */}
        {leetCodeProfile && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">LeetCode</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Username</span>
                <span className="font-medium text-gray-800">{leetCodeProfile.username}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <Badge className={getRatingBadgeColor(leetCodeProfile.rating)}>
                    {leetCodeProfile.rating}
                  </Badge>
                </div>
                <Progress 
                  value={(leetCodeProfile.rating / 3000) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Problems Solved</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-800">{leetCodeProfile.problemsSolved}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Codeforces Stats */}
        {codeforcesProfile && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Codeforces</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Handle</span>
                <span className="font-medium text-gray-800">{codeforcesProfile.handle}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Rating</span>
                  <Badge className={getRatingBadgeColor(codeforcesProfile.rating)}>
                    {codeforcesProfile.rating}
                  </Badge>
                </div>
                <Progress 
                  value={(codeforcesProfile.rating / 3000) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max Rating</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-800">{codeforcesProfile.maxRating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rank</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {codeforcesProfile.rank}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* CodeChef Stats Placeholder */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-md flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">CodeChef</h3>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              CodeChef integration will be available soon
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 group">
              <span className="text-sm font-medium text-blue-700">View Profile</span>
              <ExternalLink className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group">
              <span className="text-sm font-medium text-green-700">Practice Problems</span>
              <Code className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
