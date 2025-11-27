export interface LoanShareData {
  id: string;
  title: string;
  borrower: string;
  description?: string;
  image?: string;
  principal: number;
  totalFunded: number;
  progressPercentage: number;
}

export interface ShareUrlConfig {
  title: string;
  text: string;
  url: string;
  hashtags?: string;
  image?: string;
}

export const generateShareUrls = (loan: LoanShareData, customMessage?: string): Record<string, string> => {
  const loanUrl = `${window.location.origin}/loan/${loan.id}`;

  // Psychology-optimized default message: Hope & empowerment focused
  const progressEmoji = loan.progressPercentage >= 75 ? '🔥' : loan.progressPercentage >= 50 ? '🎯' : loan.progressPercentage >= 25 ? '✨' : '💚';
  const defaultText = `${progressEmoji} "${loan.title}" needs our help!\n\n${Math.round(loan.progressPercentage)}% funded • $${loan.totalFunded.toLocaleString()} of $${loan.principal.toLocaleString()} raised\n\nZero-interest community loan. Every dollar makes a difference!`;

  const shareText = customMessage || defaultText;

  // UTM tracking for analytics
  // Simplified UTM for platforms with character limits (Twitter)
  const shortUtmParams = (source: string) => `?utm_source=${source}&utm_medium=social`;
  const fullUtmParams = (source: string) => `?utm_source=${source}&utm_medium=social&utm_campaign=loan_share`;
  const shortTrackedUrl = (source: string) => loanUrl + shortUtmParams(source);
  const fullTrackedUrl = (source: string) => loanUrl + fullUtmParams(source);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullTrackedUrl('facebook'))}`,

    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n\n${shortTrackedUrl('twitter')}`)}`,

    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullTrackedUrl('linkedin'))}&title=${encodeURIComponent(loan.title)}&summary=${encodeURIComponent(shareText)}`,

    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n👉 ${fullTrackedUrl('whatsapp')}`)}`,

    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullTrackedUrl('telegram'))}&text=${encodeURIComponent(shareText)}`,

    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(fullTrackedUrl('reddit'))}&title=${encodeURIComponent(loan.title)}`,

    email: `mailto:?subject=${encodeURIComponent(`Help support: ${loan.title}`)}&body=${encodeURIComponent(`Hi,\n\nI wanted to share this zero-interest community loan with you:\n\n${loan.title}\n\n${shareText}\n\n${fullTrackedUrl('email')}\n\nEvery contribution makes a difference!\n\nBest regards`)}`,

    discord: fullTrackedUrl('discord'), // Discord doesn't have direct share link, will copy to clipboard

    sms: `sms:?&body=${encodeURIComponent(`${shareText}\n\n${fullTrackedUrl('sms')}`)}`,

    farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(fullTrackedUrl('farcaster'))}`,

    tiktok: `https://www.tiktok.com/share?url=${encodeURIComponent(fullTrackedUrl('tiktok'))}`,

    snapchat: `https://www.snapchat.com/share?url=${encodeURIComponent(fullTrackedUrl('snapchat'))}`
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const formatShareMessage = (template: 'personal' | 'milestone' | 'urgent' | 'grateful', loan: LoanShareData, contributionAmount?: number): string => {
  const templates = {
    personal: contributionAmount
      ? `I just contributed $${contributionAmount} to "${loan.title}" and you can help too! Every contribution brings us closer to the $${loan.principal.toLocaleString()} goal. 💚`
      : `Check out this amazing zero-interest loan for "${loan.title}"! Help ${loan.borrower} reach their goal. 💚`,

    milestone: `Amazing! "${loan.title}" just reached ${Math.round(loan.progressPercentage)}% of its goal! ${contributionAmount ? `I contributed $${contributionAmount} - ` : ''}Who's next? 🎯`,

    urgent: `Only $${(loan.principal - loan.totalFunded).toLocaleString()} left to go for "${loan.title}"! ${contributionAmount ? `I just contributed $${contributionAmount}. ` : ''}Can you help us cross the finish line? 🏃‍♂️`,

    grateful: `Feeling grateful to support "${loan.title}"${contributionAmount ? ` with a $${contributionAmount} contribution` : ''}. This cause means a lot and I hope you'll consider helping too! 🙏`
  };

  return templates[template];
};

export const trackShareEvent = async (loanId: string, platform: string, eventType: 'share' | 'click' | 'convert') => {
  try {
    await fetch('/api/analytics/share-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loanId,
        platform,
        eventType,
        timestamp: Date.now()
      }),
    });
  } catch (error) {
    console.error('Failed to track share event:', error);
  }
};
