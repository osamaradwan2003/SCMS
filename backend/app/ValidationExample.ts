/**
 * Example demonstrating the new validation system
 * This shows how to use schema-based validation with structured error responses
 */

import { ValidationHelpers, ValidationError } from "./ValidationHelpers";

// Example: Validating Guardian data
async function validateGuardianExample() {
  console.log("=== Guardian Validation Example ===");

  // Test data with various validation issues
  const testData = {
    name: "A", // Too short
    phone: "invalid-phone", // Invalid format
    email: "not-an-email", // Invalid email
    relationDegree: "", // Required field empty
  };

  try {
    // Clear any previous errors
    ValidationHelpers.clearErrors();

    // Use schema-based validation
    await ValidationHelpers.validateModelData(
      testData,
      "Guardian",
      undefined,
      false
    );

    // Additional custom validations
    ValidationHelpers.validateLength(testData.name, 2, 100, "name");
    ValidationHelpers.validatePhone(testData.phone, "phone");
    ValidationHelpers.validateEmail(testData.email, "email");

    // Check for validation errors
    if (ValidationHelpers.hasErrors()) {
      const errors = ValidationHelpers.getErrors();
      console.log("Validation Errors Found:");
      errors.forEach((error) => {
        console.log(`- Field: ${error.field}`);
        console.log(`  Message: ${error.message}`);
        console.log(`  Code: ${error.code}`);
        console.log(`  Value: ${JSON.stringify(error.value)}`);
        console.log("");
      });

      // Throw structured validation error
      ValidationHelpers.throwIfErrors();
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("Structured Validation Error:");
      console.log("Errors:", error.errors);

      // Example of how the UI can handle this
      const errorsByField = error.errors.reduce((acc, err) => {
        if (!acc[err.field]) acc[err.field] = [];
        acc[err.field].push(err);
        return acc;
      }, {} as Record<string, any[]>);

      console.log("Errors grouped by field:", errorsByField);
    }
  }
}

// Example: Successful validation
async function successfulValidationExample() {
  console.log("=== Successful Validation Example ===");

  const validData = {
    name: "John Doe",
    phone: "+1-555-123-4567",
    email: "john.doe@example.com",
    relationDegree: "Father",
  };

  try {
    ValidationHelpers.clearErrors();

    // Validate using schema
    await ValidationHelpers.validateModelData(
      validData,
      "Guardian",
      undefined,
      false
    );

    // Additional validations
    ValidationHelpers.validateLength(validData.name, 2, 100, "name");
    ValidationHelpers.validatePhone(validData.phone, "phone");
    ValidationHelpers.validateEmail(validData.email, "email");

    // Check for errors
    ValidationHelpers.throwIfErrors();

    console.log("✅ All validations passed!");
    console.log("Data is valid:", validData);
  } catch (error) {
    console.log("❌ Unexpected validation error:", error);
  }
}

// Example: Update validation with exclusion
async function updateValidationExample() {
  console.log("=== Update Validation Example ===");

  const updateData = {
    name: "Jane Smith",
    phone: "+1-555-987-6543", // This phone might exist for another guardian
  };

  const guardianId = "existing-guardian-id";

  try {
    ValidationHelpers.clearErrors();

    // Validate for update (excludes current record from uniqueness checks)
    await ValidationHelpers.validateModelData(
      updateData,
      "Guardian",
      guardianId,
      true
    );

    ValidationHelpers.throwIfErrors();

    console.log("✅ Update validation passed!");
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("❌ Update validation failed:");
      error.errors.forEach((err) => {
        console.log(`- ${err.field}: ${err.message}`);
      });
    }
  }
}

// Run examples
export async function runValidationExamples() {
  await validateGuardianExample();
  console.log("\n" + "=".repeat(50) + "\n");

  await successfulValidationExample();
  console.log("\n" + "=".repeat(50) + "\n");

  await updateValidationExample();
}

// Export for testing
export {
  validateGuardianExample,
  successfulValidationExample,
  updateValidationExample,
};
