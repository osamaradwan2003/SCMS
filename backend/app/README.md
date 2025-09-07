# SCMS Backend Shared Modules

This directory contains abstract base classes and utilities that provide common functionality for all SCMS backend modules.

## Overview

The shared module system provides:
- **BaseService**: Abstract class for database operations with built-in CRUD, pagination, and search
- **BaseController**: Abstract class for HTTP request handling with standardized responses
- **ValidationHelpers**: Utility functions for data validation
- **ResponseHelpers**: Standardized API response formatting

## Quick Start

### Creating a New Service

```typescript
import { BaseService, ValidationHelpers, ValidationError } from "../shared";

interface MyEntityCreateData {
  name: string;
  email: string;
}

interface MyEntityUpdateData {
  name?: string;
  email?: string;
}

export class MyEntityService extends BaseService<any, MyEntityCreateData, MyEntityUpdateData> {
  protected modelName = "myEntity"; // Prisma model name
  protected searchFields = ["name", "email"];
  protected defaultIncludes = {
    relatedModel: true,
  };

  protected validateCreateData(data: MyEntityCreateData): void {
    ValidationHelpers.validateRequired(data, ["name", "email"]);
    if (!ValidationHelpers.validateEmail(data.email)) {
      throw new ValidationError("Invalid email format");
    }
  }

  protected validateUpdateData(data: MyEntityUpdateData): void {
    if (data.email && !ValidationHelpers.validateEmail(data.email)) {
      throw new ValidationError("Invalid email format");
    }
  }
}
```

### Creating a New Controller

```typescript
import { BaseController } from "../shared";
import { MyEntityService } from "./MyEntityService";

export class MyEntityController extends BaseController {
  protected service = new MyEntityService();
  protected entityName = "MyEntity";

  // All standard CRUD operations are inherited
  // Override only if you need custom logic
}
```

## Features

### BaseService Features

- **CRUD Operations**: `create()`, `findById()`, `findAll()`, `update()`, `delete()`
- **Pagination**: `paginate(page, limit)`
- **Search**: `search(term, options)`, `paginateSearch(term, page, limit)`
- **Bulk Operations**: `deleteMany(ids)`
- **Validation**: Built-in validation with custom hooks
- **Relationships**: Configurable default includes
- **Ordering**: Configurable default ordering

### BaseController Features

- **Standard Endpoints**: All CRUD operations with consistent responses
- **Error Handling**: Standardized error responses
- **Pagination Support**: Built-in pagination for list endpoints
- **Search Support**: Search endpoint with pagination
- **Validation**: Request validation and error handling
- **Response Formatting**: Consistent API response structure

### ValidationHelpers

- `validateRequired(data, fields)` - Check required fields
- `validateEmail(email)` - Email format validation
- `validatePhone(phone)` - Phone number validation
- `validateLength(value, min, max, fieldName)` - String length validation
- `validateRange(value, min, max, fieldName)` - Number range validation
- `validateDate(date, fieldName)` - Date validation
- `validateEnum(value, allowedValues, fieldName)` - Enum validation
- `validateUUID(value, fieldName)` - UUID validation

### ResponseHelpers

- `success(res, message, data, statusCode)` - Success responses
- `error(res, message, statusCode, error)` - Error responses
- `paginated(res, message, data, total, page, limit)` - Paginated responses
- `created(res, message, data)` - 201 Created responses
- `notFound(res, message)` - 404 Not Found responses
- `validationError(res, message)` - 422 Validation Error responses

## API Response Format

### Standard Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [...],
  "pagination": {
    "total": 100,
    "totalPages": 10,
    "currentPage": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Name is required",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Standard Endpoints

When using BaseController, you automatically get these endpoints:

- `POST /` - Create new record
- `GET /` - Get all records
- `GET /paginate` - Get paginated records
- `GET /search` - Search records with pagination
- `GET /:id` - Get record by ID
- `PUT /:id` - Update record
- `DELETE /:id` - Delete record
- `DELETE /bulk` - Delete multiple records
- `GET /count` - Get total count
- `GET /:id/exists` - Check if record exists

## Migration Guide

### Updating Existing Services

1. Import the base classes:
```typescript
import { BaseService, ValidationHelpers, ValidationError } from "../shared";
```

2. Extend BaseService:
```typescript
export class YourService extends BaseService<EntityType, CreateData, UpdateData> {
  // Configure required properties
  protected modelName = "yourModel";
  protected searchFields = ["field1", "field2"];
  
  // Implement required methods
  protected validateCreateData(data: CreateData): void { ... }
  protected validateUpdateData(data: UpdateData): void { ... }
}
```

3. Keep existing static methods for backward compatibility:
```typescript
static async createEntity(data: CreateData, userId?: string) {
  const instance = new YourService();
  return await instance.create(data, userId);
}
```

### Updating Existing Controllers

1. Import the base classes:
```typescript
import { BaseController } from "../shared";
```

2. Extend BaseController:
```typescript
export class YourController extends BaseController {
  protected service = new YourService();
  protected entityName = "YourEntity";
}
```

3. Keep existing static methods for backward compatibility:
```typescript
static async create(req: RequestWithUser, res: Response) {
  const controller = new YourController();
  return await controller.create(req, res);
}
```

## Best Practices

1. **Always validate data** in `validateCreateData()` and `validateUpdateData()`
2. **Use ValidationHelpers** for common validation patterns
3. **Implement beforeDelete()** if you need to check relationships before deletion
4. **Configure searchFields** to include all searchable text fields
5. **Set defaultIncludes** for commonly needed relationships
6. **Use ResponseHelpers** for consistent API responses
7. **Keep static methods** for backward compatibility during migration
8. **Override base methods** only when you need custom logic

## Examples

See the `templates/` directory for complete examples of:
- `ExampleService.ts` - Service implementation template
- `ExampleController.ts` - Controller implementation template

## Files Structure

```
shared/
├── BaseService.ts          # Abstract service base class
├── BaseController.ts       # Abstract controller base class
├── ValidationHelpers.ts    # Validation utilities
├── ResponseHelpers.ts      # Response formatting utilities
├── index.ts               # Main exports
├── templates/             # Example templates
│   ├── ExampleService.ts
│   └── ExampleController.ts
└── README.md             # This file
```
