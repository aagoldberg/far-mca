export const formatTimestamp = (timestamp: number): string => {
  if (timestamp === 0) return 'N/A';
  // Convert Unix timestamp (seconds) to milliseconds
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
