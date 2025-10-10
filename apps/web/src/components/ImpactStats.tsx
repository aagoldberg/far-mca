'use client';

import {
  CurrencyDollarIcon,
  HeartIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface ImpactStatsProps {
  impactData: {
    totalDonated: number;
    campaignsSupported: number;
    campaignsCompleted: number;
    peopleHelped: number;
    additionalDonationsInfluenced: number;
    donationStreak: number;
  };
}

export default function ImpactStats({ impactData }: ImpactStatsProps) {
  const stats = [
    {
      label: 'Total Donated',
      value: `$${impactData.totalDonated.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Your total contributions',
      growth: '+$25 this month'
    },
    {
      label: 'Campaigns Supported',
      value: impactData.campaignsSupported.toString(),
      icon: HeartIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'Different causes helped',
      growth: '+2 this month'
    },
    {
      label: 'Goals Reached',
      value: impactData.campaignsCompleted.toString(),
      icon: CheckCircleIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Campaigns that reached their goal',
      growth: `${impactData.campaignsCompleted > 0 ? '🎉 Recently!' : 'Soon!'}`
    },
    {
      label: 'People Helped',
      value: impactData.peopleHelped.toString(),
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Estimated lives impacted',
      growth: 'Growing daily'
    },
    {
      label: 'Social Influence',
      value: `$${impactData.additionalDonationsInfluenced.toFixed(0)}`,
      icon: ShareIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      description: 'Additional donations inspired',
      growth: 'Through your shares'
    },
    {
      label: 'Current Streak',
      value: `${impactData.donationStreak} days`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      description: 'Consistent giving',
      growth: 'Keep it up! 🔥'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.textColor} uppercase tracking-wider`}>
                {stat.label}
              </p>
              <p className="text-xs text-gray-600">{stat.description}</p>
              <p className="text-xs text-green-600 font-medium">{stat.growth}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Summary Card */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🌟 Your Impact Summary</h2>
            <p className="text-blue-100 text-lg">
              You've donated <span className="font-semibold">${impactData.totalDonated.toLocaleString()}</span> across{' '}
              <span className="font-semibold">{impactData.campaignsSupported}</span> campaigns, helping{' '}
              <span className="font-semibold">{impactData.peopleHelped}</span> people and inspiring{' '}
              <span className="font-semibold">${impactData.additionalDonationsInfluenced.toFixed(0)}</span> in additional donations!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <HeartIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}