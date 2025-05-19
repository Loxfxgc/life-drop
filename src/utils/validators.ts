export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, and one number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\d{10}$/;
  return re.test(phone);
};

export const validateBloodType = (bloodType: string): boolean => {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(bloodType);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0;
};

export const validateRequired = (value: string | number | boolean): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return true;
  }
  return value !== null && value !== undefined;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password || password.length < 8) {
    return 'weak';
  }
  
  let score = 0;
  
  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special character
  
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}; 