export function useTimeFormat() {
  // Format time from seconds to MM:SS
  const formatTimeMMSS = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Format time from seconds to HH:MM:SS
  const formatTimeHHMMSS = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Parse time string to seconds
  const parseTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    
    const parts = timeString.split(':').map(Number);
    if (parts.length === 3) {
      // Format: HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // Format: MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // Format: SS
      return parts[0];
    }
    
    return 0;
  }
  
  return {
    formatTimeMMSS,
    formatTimeHHMMSS,
    parseTimeToSeconds
  };
} 