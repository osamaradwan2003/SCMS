export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ValidationHelpers {
  // Required field validation
  static validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        throw new ValidationError(`${field} is required`);
      }
    }
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (basic)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // String length validation
  static validateLength(value: string, min: number, max: number, fieldName: string): void {
    if (value.length < min) {
      throw new ValidationError(`${fieldName} must be at least ${min} characters long`);
    }
    if (value.length > max) {
      throw new ValidationError(`${fieldName} must not exceed ${max} characters`);
    }
  }

  // Number range validation
  static validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min) {
      throw new ValidationError(`${fieldName} must be at least ${min}`);
    }
    if (value > max) {
      throw new ValidationError(`${fieldName} must not exceed ${max}`);
    }
  }

  // Date validation
  static validateDate(date: string | Date, fieldName: string): void {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError(`${fieldName} must be a valid date`);
    }
  }

  // Future date validation
  static validateFutureDate(date: string | Date, fieldName: string): void {
    this.validateDate(date, fieldName);
    const dateObj = new Date(date);
    const now = new Date();
    if (dateObj <= now) {
      throw new ValidationError(`${fieldName} must be a future date`);
    }
  }

  // Past date validation
  static validatePastDate(date: string | Date, fieldName: string): void {
    this.validateDate(date, fieldName);
    const dateObj = new Date(date);
    const now = new Date();
    if (dateObj >= now) {
      throw new ValidationError(`${fieldName} must be a past date`);
    }
  }

  // Enum validation
  static validateEnum(value: string, allowedValues: string[], fieldName: string): void {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
  }

  // Array validation
  static validateArray(value: any, fieldName: string, minLength?: number, maxLength?: number): void {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an array`);
    }
    if (minLength !== undefined && value.length < minLength) {
      throw new ValidationError(`${fieldName} must contain at least ${minLength} items`);
    }
    if (maxLength !== undefined && value.length > maxLength) {
      throw new ValidationError(`${fieldName} must contain at most ${maxLength} items`);
    }
  }

  // UUID validation
  static validateUUID(value: string, fieldName: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid UUID`);
    }
  }

  // Sanitization helpers
  static sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '');
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}
