export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatBloodType = (bloodType: string): string => {
  return bloodType.toUpperCase();
};

export const formatQuantity = (quantity: number, unit: string = 'units'): string => {
  return `${quantity} ${unit}`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
}; 