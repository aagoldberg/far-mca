import { User } from '@privy-io/react-auth';

export type SocialPlatform = 'google' | 'twitter' | 'discord' | 'farcaster' | 'telegram' | 'instagram' | 'spotify' | 'tiktok' | 'linkedin' | 'github' | 'apple';

export interface SocialProfile {
  name: string | null;
  avatar: string | null;
  username: string | null;
  platform: SocialPlatform | null;
  platforms: SocialPlatform[];
  trustScore: number;
}

export const PLATFORM_PRIORITY: SocialPlatform[] = [
  'google',
  'twitter',
  'farcaster',
  'discord',
  'telegram',
  'instagram',
  'spotify',
  'tiktok',
  'linkedin',
  'github',
  'apple'
];

export const PLATFORM_ICONS: Record<SocialPlatform, JSX.Element> = {
  google: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  twitter: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  discord: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  ),
  farcaster: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 3.75H5.76A2.01 2.01 0 003.75 5.76v12.48a2.01 2.01 0 002.01 2.01h12.48a2.01 2.01 0 002.01-2.01V5.76a2.01 2.01 0 00-2.01-2.01zM17.1 17.1h-2.4v-6.6c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v6.6H9.9v-6.6c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v6.6H5.1V6.9h12v10.2z"/>
    </svg>
  ),
  telegram: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 1 0 24 12 12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
    </svg>
  ),
  spotify: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  github: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  apple: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
};

export function getBestName(user: User | null | undefined): string | null {
  if (!user) return null;
  
  // Priority order for names
  if (user.google?.name) return user.google.name;
  if (user.apple?.email) return user.apple.email.split('@')[0];
  if (user.twitter?.username) return user.twitter.username;
  if (user.farcaster?.username) return user.farcaster.username;
  if (user.discord?.username) return user.discord.username;
  if (user.telegram?.username) return user.telegram.username;
  if (user.instagram?.username) return user.instagram.username;
  if (user.tiktok?.username) return user.tiktok.username;
  if (user.linkedin?.name) return user.linkedin.name;
  if (user.github?.username) return user.github.username;
  if (user.spotify?.email) return user.spotify.email.split('@')[0];
  if (user.email?.address) return user.email.address.split('@')[0];
  
  return null;
}

export function getBestAvatar(user: User | null | undefined): string | null {
  if (!user) return null;
  
  // Priority order for avatars (high quality sources first)
  if (user.google?.profilePictureUrl) return user.google.profilePictureUrl;
  if (user.twitter?.profilePictureUrl) return user.twitter.profilePictureUrl;
  if (user.farcaster?.pfp) return user.farcaster.pfp;
  if (user.discord?.profilePictureUrl) return user.discord.profilePictureUrl;
  if (user.telegram?.photoUrl) return user.telegram.photoUrl;
  if (user.instagram?.profilePictureUrl) return user.instagram.profilePictureUrl;
  if (user.tiktok?.avatarUrl) return user.tiktok.avatarUrl;
  if (user.linkedin?.pictureUrl) return user.linkedin.pictureUrl;
  if (user.github?.profilePictureUrl) return user.github.profilePictureUrl;
  if (user.spotify?.profilePictureUrl) return user.spotify.profilePictureUrl;
  
  return null;
}

export function getConnectedPlatforms(user: User | null | undefined): SocialPlatform[] {
  if (!user) return [];
  
  const platforms: SocialPlatform[] = [];
  
  if (user.google) platforms.push('google');
  if (user.twitter) platforms.push('twitter');
  if (user.discord) platforms.push('discord');
  if (user.farcaster) platforms.push('farcaster');
  if (user.telegram) platforms.push('telegram');
  if (user.instagram) platforms.push('instagram');
  if (user.spotify) platforms.push('spotify');
  if (user.tiktok) platforms.push('tiktok');
  if (user.linkedin) platforms.push('linkedin');
  if (user.github) platforms.push('github');
  if (user.apple) platforms.push('apple');
  
  return platforms;
}

export function getTrustScore(user: User | null | undefined): number {
  if (!user) return 0;
  
  const platforms = getConnectedPlatforms(user);
  let score = 0;
  
  // Base score for each connected platform
  score += platforms.length * 10;
  
  // Bonus for high-trust platforms
  if (platforms.includes('google')) score += 15;
  if (platforms.includes('linkedin')) score += 10;
  if (platforms.includes('github')) score += 8;
  
  // Bonus for social platforms
  if (platforms.includes('twitter')) score += 5;
  if (platforms.includes('farcaster')) score += 5;
  
  // Email verification bonus
  if (user.email?.address) score += 10;
  
  // Wallet connection bonus
  if (user.wallet) score += 20;
  
  // Cap at 100
  return Math.min(score, 100);
}

export function getSocialProfile(user: User | null | undefined): SocialProfile {
  const name = getBestName(user);
  const avatar = getBestAvatar(user);
  const platforms = getConnectedPlatforms(user);
  const trustScore = getTrustScore(user);
  
  // Get username from the primary platform
  let username: string | null = null;
  let platform: SocialPlatform | null = null;
  
  if (user) {
    for (const p of PLATFORM_PRIORITY) {
      if (platforms.includes(p)) {
        platform = p;
        switch (p) {
          case 'google':
            username = user.google?.email?.split('@')[0] || null;
            break;
          case 'twitter':
            username = user.twitter?.username || null;
            break;
          case 'discord':
            username = user.discord?.username || null;
            break;
          case 'farcaster':
            username = user.farcaster?.username || null;
            break;
          case 'telegram':
            username = user.telegram?.username || null;
            break;
          case 'instagram':
            username = user.instagram?.username || null;
            break;
          case 'tiktok':
            username = user.tiktok?.username || null;
            break;
          case 'linkedin':
            username = user.linkedin?.email?.split('@')[0] || null;
            break;
          case 'github':
            username = user.github?.username || null;
            break;
          case 'spotify':
            username = user.spotify?.email?.split('@')[0] || null;
            break;
          case 'apple':
            username = user.apple?.email?.split('@')[0] || null;
            break;
        }
        if (username) break;
      }
    }
  }
  
  return {
    name,
    avatar,
    username,
    platform,
    platforms,
    trustScore
  };
}

export function formatDisplayName(user: User | null | undefined, walletAddress?: string): string {
  const name = getBestName(user);
  if (name) return name;
  
  if (walletAddress) {
    return `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
  }
  
  if (user?.wallet?.address) {
    return `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`;
  }
  
  return 'Anonymous';
}

interface PlatformBadgesProps {
  platforms: SocialPlatform[];
  className?: string;
  showAll?: boolean;
  maxDisplay?: number;
}

export function PlatformBadges({ platforms, className = "", showAll = false, maxDisplay = 3 }: PlatformBadgesProps) {
  const displayPlatforms = showAll ? platforms : platforms.slice(0, maxDisplay);
  const remaining = platforms.length - displayPlatforms.length;
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {displayPlatforms.map(platform => (
        <div 
          key={platform}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title={platform.charAt(0).toUpperCase() + platform.slice(1)}
        >
          {PLATFORM_ICONS[platform]}
        </div>
      ))}
      {remaining > 0 && !showAll && (
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600">
          <span className="text-xs font-medium">+{remaining}</span>
        </div>
      )}
    </div>
  );
}

interface TrustIndicatorProps {
  score: number;
  className?: string;
  showLabel?: boolean;
}

export function TrustIndicator({ score, className = "", showLabel = false }: TrustIndicatorProps) {
  const getColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  const getLabel = () => {
    if (score >= 80) return 'Verified';
    if (score >= 60) return 'Trusted';
    if (score >= 40) return 'Member';
    return 'New';
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center px-2 py-0.5 rounded-full ${getColor()}`}>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {showLabel && <span className="text-xs font-medium">{getLabel()}</span>}
      </div>
    </div>
  );
}