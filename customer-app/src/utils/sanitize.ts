/**
 * Sanitize user input to prevent XSS attacks
 */

// HTML entities that need to be escaped
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML special characters in a string
 */
export const escapeHtml = (text: string): string => {
  return String(text).replace(/[&<>"'\/]/g, (match) => htmlEntities[match]);
};

/**
 * Sanitize user input for safe display
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any script tags
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Escape HTML entities
  sanitized = escapeHtml(sanitized);
  
  return sanitized.trim();
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email: string): string => {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return '';
  }
  
  return escapeHtml(trimmed);
};

/**
 * Validate and sanitize phone number
 */
export const sanitizePhone = (phone: string): string => {
  // Remove all non-digit characters except + for international
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic validation
  if (cleaned.length < 10 || cleaned.length > 15) {
    return '';
  }
  
  return cleaned;
};

/**
 * Sanitize object with multiple fields
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key as keyof T] = sanitizeEmail(value) as T[keyof T];
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key as keyof T] = sanitizePhone(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
      }
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};