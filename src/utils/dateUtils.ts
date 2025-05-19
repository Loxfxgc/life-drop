export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const getTimeFromNow = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const calculateExpirationDate = (donationDate: string): string => {
  // Blood typically expires after 42 days (6 weeks)
  const date = new Date(donationDate);
  date.setDate(date.getDate() + 42);
  return date.toISOString().split('T')[0];
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

export const isBetweenDates = (
  dateToCheck: string, 
  startDate: string, 
  endDate: string
): boolean => {
  const date = new Date(dateToCheck);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return date >= start && date <= end;
}; 