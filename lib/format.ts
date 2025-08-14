/**
 * Utility functions for formatting data for display
 */

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with cents
 */
export function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format dates for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format dates with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format relative dates (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
}

/**
 * Format numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format hours
 */
export function formatHours(hours: number): string {
  if (hours === 1) return '1 hour';
  return `${hours.toFixed(1)} hours`;
}

/**
 * Format phone numbers
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format system type for display
 */
export function formatSystemType(systemType: string): string {
  const typeMap: Record<string, string> = {
    'RTU': 'Rooftop Unit',
    'split': 'Split System',
    'mini-split': 'Mini-Split',
    'chiller': 'Chiller',
    'boiler': 'Boiler',
    'refrigeration': 'Refrigeration',
  };
  
  return typeMap[systemType] || systemType;
}

/**
 * Format job type for display
 */
export function formatJobType(jobType: string): string {
  const typeMap: Record<string, string> = {
    'service': 'Service Call',
    'pm': 'Preventive Maintenance',
    'install': 'Installation',
  };
  
  return typeMap[jobType] || jobType;
}

/**
 * Format status for display
 */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get status color for badges
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'scheduled': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'done': 'bg-green-100 text-green-800',
    'invoiced': 'bg-purple-100 text-purple-800',
    'paid': 'bg-emerald-100 text-emerald-800',
    'canceled': 'bg-red-100 text-red-800',
    'active': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'pending_renewal': 'bg-yellow-100 text-yellow-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get priority color based on value
 */
export function getPriorityColor(value: number, thresholds: { low: number; medium: number; high: number }): string {
  if (value >= thresholds.high) return 'text-red-600';
  if (value >= thresholds.medium) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Format variance with + or - sign
 */
export function formatVariance(variance: number): string {
  const sign = variance >= 0 ? '+' : '';
  return `${sign}${variance.toFixed(1)}%`;
}

/**
 * Get variance color (red for negative, green for positive)
 */
export function getVarianceColor(variance: number): string {
  if (variance > 0) return 'text-green-600';
  if (variance < 0) return 'text-red-600';
  return 'text-gray-600';
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}