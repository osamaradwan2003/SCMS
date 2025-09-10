# Enhanced Validation System Documentation

## Overview

The SCMS backend now features a comprehensive validation system that:
- Returns structured error messages to the UI
- Depends on the Prisma database schema for automatic validation
- Provides consistent error handling across all modules
- Supports both field-level and model-level validation

## Key Components

### 1. ValidationHelpers Class

Enhanced with structured error collection and schema-based validation:

```typescript
// Clear errors before validation
ValidationHelpers.clearErrors();

// Add individual errors
ValidationHelpers.addError(field, message, code, value);

// Schema-based validation
await ValidationHelpers.validateModelData(data, 'ModelName', excludeId, isUpdate);

// Throw if any errors exist
ValidationHelpers.throwIfErrors();
```

### 2. ValidationError Class

Now supports structured error details:

```typescript
interface ValidationErrorDetail {
  field: string;      // Field name that failed validation
  message: string;    // Human-readable error message
  code: string;       // Error code for programmatic handling
  value?: any;        // The value that failed validation
}
```

### 3. Enhanced API Responses

All API responses now include structured validation errors:

```typescript
interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  validationErrors?: ValidationErrorDetail[];
}
```

## Schema-Based Validation

### Automatic Field Validation

The system automatically validates fields based on Prisma schema:

- **Required fields**: Checks if non-optional fields are present
- **Data types**: Validates String, Int, Float, Decimal, Boolean, DateTime
- **Unique constraints**: Automatically checks uniqueness for fields marked as `@unique`
- **String length**: Applies default length constraints
- **Foreign keys**: Validates referenced records exist

### Usage Example

```typescript
// In your service class
protected async validateCreateData(data: CreateData): Promise<void> {
  // Schema-based validation
  await ValidationHelpers.validateModelData(data, 'ModelName', undefined, false);
  
  // Additional custom validations
  ValidationHelpers.validateLength(data.name, 2, 100, "name");
  
  // Throw if any validation errors
  ValidationHelpers.throwIfErrors();
}
```

## Error Response Format

### Validation Error Response (HTTP 422)

```json
{
  "message": "Validation failed",
  "error": "Validation failed",
  "validationErrors": [
    {
      "field": "phone",
      "message": "phone must be a valid phone number",
      "code": "INVALID_PHONE",
      "value": "invalid-phone"
    },
    {
      "field": "email",
      "message": "email 'test@example.com' already exists",
      "code": "DUPLICATE_VALUE",
      "value": "test@example.com"
    }
  ]
}
```

### Standard Error Response

```json
{
  "message": "Error message",
  "error": "Error details",
  "validationErrors": [] // Optional, only if validation errors exist
}
```

## Error Codes

The system uses standardized error codes for programmatic handling:

- `REQUIRED_FIELD`: Field is required but missing
- `INVALID_TYPE`: Wrong data type
- `INVALID_EMAIL`: Invalid email format
- `INVALID_PHONE`: Invalid phone format
- `DUPLICATE_VALUE`: Unique constraint violation
- `MIN_LENGTH` / `MAX_LENGTH`: String length validation
- `MIN_VALUE` / `MAX_VALUE`: Number range validation
- `INVALID_DATE`: Date format validation
- `FOREIGN_KEY_ERROR`: Referenced record doesn't exist
- `SCHEMA_ERROR`: Schema-related validation error

## Frontend Integration

### Handling Validation Errors in UI

```typescript
// Example API call with error handling
try {
  const response = await api.post('/guardians', guardianData);
  // Handle success
} catch (error) {
  if (error.response?.status === 422) {
    const validationErrors = error.response.data.validationErrors;
    
    // Group errors by field for form display
    const errorsByField = validationErrors.reduce((acc, err) => {
      if (!acc[err.field]) acc[err.field] = [];
      acc[err.field].push(err.message);
      return acc;
    }, {});
    
    // Display field-specific errors in form
    setFormErrors(errorsByField);
  }
}
```

### Ant Design Form Integration

```typescript
// Convert validation errors to Ant Design format
const antdErrors = validationErrors.map(err => ({
  name: err.field,
  errors: [err.message]
}));

form.setFields(antdErrors);
```

## Migration Guide

### Updating Existing Services

1. **Make validation methods async**:
```typescript
// Before
protected validateCreateData(data: CreateData): void {
  // validation logic
}

// After
protected async validateCreateData(data: CreateData): Promise<void> {
  await ValidationHelpers.validateModelData(data, 'ModelName');
  ValidationHelpers.throwIfErrors();
}
```

2. **Update validation calls**:
```typescript
// Before
ValidationHelpers.validateRequired(data, ['field1', 'field2']);

// After
ValidationHelpers.clearErrors();
await ValidationHelpers.validateModelData(data, 'ModelName');
ValidationHelpers.throwIfErrors();
```

3. **Handle structured errors in controllers**:
```typescript
// Controllers automatically handle ValidationError instances
// No changes needed if extending BaseController
```

## Benefits

1. **Consistent Validation**: All models use the same validation approach
2. **Schema Synchronization**: Validation rules automatically match database schema
3. **Better UX**: Structured errors enable field-specific error display
4. **Maintainability**: Centralized validation logic reduces code duplication
5. **Type Safety**: Full TypeScript support with proper error typing

## Example Implementation

See `ValidationExample.ts` for comprehensive examples of:
- Basic validation with error handling
- Successful validation scenarios
- Update validation with record exclusion
- Error grouping for UI display

## Testing

The validation system includes comprehensive error scenarios:
- Missing required fields
- Invalid data types
- Duplicate values
- Invalid formats (email, phone)
- String length violations
- Foreign key violations

All validation errors are properly structured and ready for UI consumption.
