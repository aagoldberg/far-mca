'use client';

import {
  TrophyIcon,
  LockClosedIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  earned: boolean;
  date?: string;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
  nextAchievement?: Achievement;
}

export default function AchievementBadges({ achievements, nextAchievement }: AchievementBadgesProps) {
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
          Achievements
        </h3>
        <div className="text-sm text-gray-500">
          {achievements.length} earned
        </div>
      </div>

      {/* Earned Achievements */}
      <div className="space-y-4 mb-6">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className={`p-2 rounded-lg ${achievement.color} flex-shrink-0`}>
                <achievement.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                {achievement.date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3" />
                    Earned {formatDate(achievement.date)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Make your first donation to start earning achievements!</p>
          </div>
        )}
      </div>

      {/* Next Achievement Preview */}
      {nextAchievement && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Up Next</h4>
          <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-75">
            <div className="p-2 bg-gray-300 rounded-lg flex-shrink-0">
              <LockClosedIcon className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-700">{nextAchievement.name}</h4>
              <p className="text-sm text-gray-600">{nextAchievement.description}</p>
              <p className="text-xs text-gray-500 mt-1">Keep going to unlock this achievement!</p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Progress */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Achievement Progress</span>
          <span className="text-sm text-blue-700">{achievements.length}/6</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(achievements.length / 6) * 100}%` }}
          />
        </div>
        <p className="text-xs text-blue-700 mt-2">
          {achievements.length === 6 
            ? "🎉 All achievements unlocked!" 
            : `${6 - achievements.length} more to unlock`
          }
        </p>
      </div>
    </div>
  );
}