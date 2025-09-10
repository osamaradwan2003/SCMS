import { PrismaClient } from "@prisma/client";
import { prisma } from "@db/client";

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export class ValidationError extends Error {
  public errors: ValidationErrorDetail[];
  
  constructor(errors: ValidationErrorDetail[] | string) {
    if (typeof errors === 'string') {
      super(errors);
      this.errors = [{ field: 'general', message: errors, code: 'VALIDATION_ERROR' }];
    } else {
      super('Validation failed');
      this.errors = errors;
    }
    this.name = "ValidationError";
  }

  addError(field: string, message: string, code: string, value?: any) {
    this.errors.push({ field, message, code, value });
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrorsForField(field: string): ValidationErrorDetail[] {
    return this.errors.filter(error => error.field === field);
  }
}

export class ValidationHelpers {
  private static errors: ValidationErrorDetail[] = [];

  // Clear errors before validation
  static clearErrors(): void {
    this.errors = [];
  }

  // Add error to collection
  static addError(field: string, message: string, code: string, value?: any): void {
    this.errors.push({ field, message, code, value });
  }

  // Get all errors
  static getErrors(): ValidationErrorDetail[] {
    return [...this.errors];
  }

  // Check if there are any errors
  static hasErrors(): boolean {
    return this.errors.length > 0;
  }

  // Throw validation error if there are any errors
  static throwIfErrors(): void {
    if (this.hasErrors()) {
      throw new ValidationError(this.getErrors());
    }
  }

  // Required field validation
  static validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        this.addError(field, `${field} is required`, 'REQUIRED_FIELD', data[field]);
      }
    }
  }

  static validateString(value: string, fieldName: string): void {
    if (typeof value !== "string") {
      this.addError(fieldName, `${fieldName} must be a string`, 'INVALID_TYPE', value);
    } else if (value.trim() === "") {
      this.addError(fieldName, `${fieldName} cannot be empty`, 'EMPTY_STRING', value);
    } else if (!isNaN(Number(value))) {
      this.addError(fieldName, `${fieldName} cannot be a numeric string`, 'NUMERIC_STRING', value);
    }
  }

  // Email validation
  static validateEmail(email: string, fieldName: string = 'email'): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
      this.addError(fieldName, `${fieldName} must be a valid email address`, 'INVALID_EMAIL', email);
    }
    return isValid;
  }

  // Phone validation (basic)
  static validatePhone(phone: string, fieldName: string = 'phone'): boolean {
    const phoneRegex =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const isValid = phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
    if (!isValid) {
      this.addError(fieldName, `${fieldName} must be a valid phone number`, 'INVALID_PHONE', phone);
    }
    return isValid;
  }

  // String length validation
  static validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string
  ): void {
    if (value.length < min) {
      this.addError(
        fieldName,
        `${fieldName} must be at least ${min} characters long`,
        'MIN_LENGTH',
        { value, min, max, actualLength: value.length }
      );
    }
    if (value.length > max) {
      this.addError(
        fieldName,
        `${fieldName} must not exceed ${max} characters`,
        'MAX_LENGTH',
        { value, min, max, actualLength: value.length }
      );
    }
  }

  static async validateUnique(
    value: string,
    modelName: string,
    field: string,
    excludeId?: string
  ): Promise<boolean> {
    if (!value) {
      this.addError(field, `${field} is required`, 'REQUIRED_FIELD', value);
      return false;
    }

    try {
      const whereClause: any = { [field]: value };
      if (excludeId) {
        whereClause.id = { not: excludeId };
      }

      const result = await (prisma as any)[modelName].findUnique({
        where: whereClause,
        select: { id: true }
      });

      if (result) {
        this.addError(field, `${field} '${value}' already exists`, 'DUPLICATE_VALUE', value);
        return false;
      }
      return true;
    } catch (error) {
      this.addError(field, `Error validating ${field} uniqueness`, 'VALIDATION_ERROR', value);
      return false;
    }
  }

  // Number range validation
  static validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): void {
    if (value < min) {
      this.addError(
        fieldName,
        `${fieldName} must be at least ${min}`,
        'MIN_VALUE',
        { value, min, max }
      );
    }
    if (value > max) {
      this.addError(
        fieldName,
        `${fieldName} must not exceed ${max}`,
        'MAX_VALUE',
        { value, min, max }
      );
    }
  }

  // Date validation
  static validateDate(date: string | Date, fieldName: string): void {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      this.addError(fieldName, `${fieldName} must be a valid date`, 'INVALID_DATE', date);
    }
  }

  // Future date validation
  static validateFutureDate(date: string | Date, fieldName: string): void {
    this.validateDate(date, fieldName);
    const dateObj = new Date(date);
    const now = new Date();
    if (dateObj <= now) {
      this.addError(fieldName, `${fieldName} must be a future date`, 'PAST_DATE', date);
    }
  }

  // Past date validation
  static validatePastDate(date: string | Date, fieldName: string): void {
    this.validateDate(date, fieldName);
    const dateObj = new Date(date);
    const now = new Date();
    if (dateObj >= now) {
      this.addError(fieldName, `${fieldName} must be a past date`, 'FUTURE_DATE', date);
    }
  }

  // Enum validation
  static validateEnum(
    value: string,
    allowedValues: string[],
    fieldName: string
  ): void {
    if (!allowedValues.includes(value)) {
      this.addError(
        fieldName,
        `${fieldName} must be one of: ${allowedValues.join(", ")}`,
        'INVALID_ENUM',
        { value, allowedValues }
      );
    }
  }

  // Array validation
  static validateArray(
    value: any,
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ): void {
    if (!Array.isArray(value)) {
      this.addError(fieldName, `${fieldName} must be an array`, 'INVALID_TYPE', value);
      return;
    }
    if (minLength !== undefined && value.length < minLength) {
      this.addError(
        fieldName,
        `${fieldName} must contain at least ${minLength} items`,
        'MIN_ARRAY_LENGTH',
        { value, minLength, maxLength, actualLength: value.length }
      );
    }
    if (maxLength !== undefined && value.length > maxLength) {
      this.addError(
        fieldName,
        `${fieldName} must contain at most ${maxLength} items`,
        'MAX_ARRAY_LENGTH',
        { value, minLength, maxLength, actualLength: value.length }
      );
    }
  }

  // UUID validation
  static validateUUID(value: string, fieldName: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      this.addError(fieldName, `${fieldName} must be a valid UUID`, 'INVALID_UUID', value);
    }
  }

  // Sanitization helpers
  static sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, " ");
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, "");
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  // Schema-based validation methods
  static async validateSchemaField(
    value: any,
    modelName: string,
    fieldName: string,
    excludeId?: string
  ): Promise<void> {
    try {
      // Get field information from Prisma schema
      const model = (prisma as any)._dmmf.datamodel.models.find(
        (m: any) => m.name.toLowerCase() === modelName.toLowerCase()
      );
      
      if (!model) {
        this.addError(fieldName, `Model ${modelName} not found in schema`, 'SCHEMA_ERROR', value);
        return;
      }

      const field = model.fields.find((f: any) => f.name === fieldName);
      if (!field) {
        this.addError(fieldName, `Field ${fieldName} not found in ${modelName} schema`, 'SCHEMA_ERROR', value);
        return;
      }

      // Check if field is required
      if (!field.isOptional && (value === null || value === undefined || value === '')) {
        this.addError(fieldName, `${fieldName} is required`, 'REQUIRED_FIELD', value);
        return;
      }

      // Skip validation if field is optional and empty
      if (field.isOptional && (value === null || value === undefined || value === '')) {
        return;
      }

      // Type-based validation
      switch (field.type) {
        case 'String':
          if (typeof value !== 'string') {
            this.addError(fieldName, `${fieldName} must be a string`, 'INVALID_TYPE', value);
          } else {
            // Check for unique constraint
            if (field.isUnique) {
              await this.validateUnique(value, modelName, fieldName, excludeId);
            }
            // Check string length based on database constraints
            if (field.type === 'String' && value.length > 255) { // Default varchar length
              this.addError(fieldName, `${fieldName} is too long (max 255 characters)`, 'MAX_LENGTH', value);
            }
          }
          break;

        case 'Int':
          if (!Number.isInteger(Number(value))) {
            this.addError(fieldName, `${fieldName} must be an integer`, 'INVALID_TYPE', value);
          }
          break;

        case 'Float':
        case 'Decimal':
          if (isNaN(Number(value))) {
            this.addError(fieldName, `${fieldName} must be a number`, 'INVALID_TYPE', value);
          }
          break;

        case 'Boolean':
          if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
            this.addError(fieldName, `${fieldName} must be a boolean`, 'INVALID_TYPE', value);
          }
          break;

        case 'DateTime':
          this.validateDate(value, fieldName);
          break;

        default:
          // Handle custom types and relations
          if (field.kind === 'enum') {
            // Handle enum validation - would need enum values from schema
            // This is a placeholder for enum validation
          }
          break;
      }

      // Handle specific field validations based on field name patterns
      if (fieldName.toLowerCase().includes('email')) {
        this.validateEmail(value, fieldName);
      }
      
      if (fieldName.toLowerCase().includes('phone')) {
        this.validatePhone(value, fieldName);
      }

    } catch (error) {
      this.addError(fieldName, `Schema validation error for ${fieldName}`, 'SCHEMA_ERROR', value);
    }
  }

  // Validate entire model data against schema
  static async validateModelData(
    data: any,
    modelName: string,
    excludeId?: string,
    isUpdate: boolean = false
  ): Promise<void> {
    this.clearErrors();

    try {
      const model = (prisma as any)._dmmf.datamodel.models.find(
        (m: any) => m.name.toLowerCase() === modelName.toLowerCase()
      );
      
      if (!model) {
        this.addError('general', `Model ${modelName} not found in schema`, 'SCHEMA_ERROR', data);
        return;
      }

      // Validate each field in the data
      for (const [fieldName, value] of Object.entries(data)) {
        // Skip system fields for updates
        if (isUpdate && ['id', 'created_at', 'updated_at'].includes(fieldName)) {
          continue;
        }

        await this.validateSchemaField(value, modelName, fieldName, excludeId);
      }

      // Check for required fields that are missing (only for create operations)
      if (!isUpdate) {
        for (const field of model.fields) {
          if (!field.isOptional && 
              !field.hasDefaultValue && 
              field.name !== 'id' && 
              field.name !== 'created_at' && 
              field.name !== 'updated_at' &&
              !(field.name in data)) {
            this.addError(field.name, `${field.name} is required`, 'REQUIRED_FIELD', undefined);
          }
        }
      }

    } catch (error) {
      this.addError('general', `Model validation error for ${modelName}`, 'SCHEMA_ERROR', data);
    }
  }

  // Validate foreign key relationships
  static async validateForeignKey(
    value: string,
    referencedModel: string,
    fieldName: string
  ): Promise<boolean> {
    if (!value) return true; // Skip if empty (handled by required validation)

    try {
      const record = await (prisma as any)[referencedModel].findUnique({
        where: { id: value },
        select: { id: true }
      });

      if (!record) {
        this.addError(fieldName, `Referenced ${referencedModel} with id '${value}' does not exist`, 'FOREIGN_KEY_ERROR', value);
        return false;
      }
      return true;
    } catch (error) {
      this.addError(fieldName, `Error validating ${fieldName} reference`, 'VALIDATION_ERROR', value);
      return false;
    }
  }
}
