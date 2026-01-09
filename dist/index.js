"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// validation/index.ts
var index_exports = {};
__export(index_exports, {
  BusinessRules: () => BusinessRules,
  CrossFieldRules: () => CrossFieldRules,
  ErrorCode: () => ErrorCode,
  FormatRules: () => FormatRules,
  PatternRules: () => PatternRules,
  Rules: () => Rules,
  SchemaValidator: () => SchemaValidator,
  Validator: () => Validator,
  createSchema: () => createSchema,
  failureResult: () => failureResult,
  successResult: () => successResult
});
module.exports = __toCommonJS(index_exports);

// validation/core/ErrorCodes.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["REQUIRED"] = "REQUIRED";
  ErrorCode2["NOT_NULL"] = "NOT_NULL";
  ErrorCode2["NOT_EMPTY"] = "NOT_EMPTY";
  ErrorCode2["INVALID_TYPE"] = "INVALID_TYPE";
  ErrorCode2["MIN_VALUE"] = "MIN_VALUE";
  ErrorCode2["MAX_VALUE"] = "MAX_VALUE";
  ErrorCode2["RANGE"] = "RANGE";
  ErrorCode2["MIN_LENGTH"] = "MIN_LENGTH";
  ErrorCode2["MAX_LENGTH"] = "MAX_LENGTH";
  ErrorCode2["LENGTH_RANGE"] = "LENGTH_RANGE";
  ErrorCode2["INVALID_FORMAT"] = "INVALID_FORMAT";
  ErrorCode2["PATTERN_MISMATCH"] = "PATTERN_MISMATCH";
  ErrorCode2["CONTAINS_FORBIDDEN"] = "CONTAINS_FORBIDDEN";
  ErrorCode2["MISSING_REQUIRED"] = "MISSING_REQUIRED";
  ErrorCode2["CROSS_FIELD_INVALID"] = "CROSS_FIELD_INVALID";
  ErrorCode2["CUSTOM_ERROR"] = "CUSTOM_ERROR";
  ErrorCode2["ASYNC_VALIDATION_FAILED"] = "ASYNC_VALIDATION_FAILED";
  ErrorCode2["SECURITY_RISK"] = "SECURITY_RISK";
  ErrorCode2["CONTENT_POLICY"] = "CONTENT_POLICY";
  ErrorCode2["INVALID_EMAIL"] = "INVALID_EMAIL";
  ErrorCode2["INVALID_PHONE"] = "INVALID_PHONE";
  ErrorCode2["INVALID_URL"] = "INVALID_URL";
  ErrorCode2["INVALID_UUID"] = "INVALID_UUID";
  ErrorCode2["INVALID_IP"] = "INVALID_IP";
  ErrorCode2["INVALID_DATE"] = "INVALID_DATE";
  ErrorCode2["PAST_DATE"] = "PAST_DATE";
  ErrorCode2["FUTURE_DATE"] = "FUTURE_DATE";
  return ErrorCode2;
})(ErrorCode || {});

// validation/core/ValidationResult.ts
var successResult = () => ({
  valid: true,
  errors: []
});
var failureResult = (errors) => ({
  valid: false,
  errors
});

// validation/rules/primitive.ts
var Rules = {
  required: () => (value) => {
    if (value === void 0 || value === null || value === "") {
      return { field: "", errorCode: "REQUIRED" /* REQUIRED */, message: "This field is required", severity: "error" };
    }
    return null;
  },
  notNull: () => (value) => {
    if (value === null) {
      return { field: "", errorCode: "NOT_NULL" /* NOT_NULL */, message: "Value cannot be null", severity: "error" };
    }
    return null;
  },
  isString: () => (value) => {
    if (value !== void 0 && value !== null && typeof value !== "string") {
      return { field: "", errorCode: "INVALID_TYPE" /* INVALID_TYPE */, message: "Value must be a string", severity: "error" };
    }
    return null;
  },
  isNumber: () => (value) => {
    if (value !== void 0 && value !== null && (typeof value !== "number" || isNaN(value))) {
      return { field: "", errorCode: "INVALID_TYPE" /* INVALID_TYPE */, message: "Value must be a number", severity: "error" };
    }
    return null;
  },
  min: (min) => (value) => {
    if (typeof value === "number" && value < min) {
      return { field: "", errorCode: "MIN_VALUE" /* MIN_VALUE */, message: `Value must be at least ${min}`, severity: "error", params: { min } };
    }
    if (typeof value === "string" && value.length < min) {
      return { field: "", errorCode: "MIN_LENGTH" /* MIN_LENGTH */, message: `Length must be at least ${min}`, severity: "error", params: { min } };
    }
    return null;
  },
  max: (max) => (value) => {
    if (typeof value === "number" && value > max) {
      return { field: "", errorCode: "MAX_VALUE" /* MAX_VALUE */, message: `Value must be at most ${max}`, severity: "error", params: { max } };
    }
    if (typeof value === "string" && value.length > max) {
      return { field: "", errorCode: "MAX_LENGTH" /* MAX_LENGTH */, message: `Length must be at most ${max}`, severity: "error", params: { max } };
    }
    return null;
  }
};

// validation/rules/format.ts
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var FormatRules = {
  email: () => (value) => {
    if (typeof value === "string" && value && !EMAIL_REGEX.test(value)) {
      return { field: "", errorCode: "INVALID_EMAIL" /* INVALID_EMAIL */, message: "Invalid email address", severity: "error" };
    }
    return null;
  },
  url: () => (value) => {
    if (typeof value === "string" && value && !URL_REGEX.test(value)) {
      return { field: "", errorCode: "INVALID_URL" /* INVALID_URL */, message: "Invalid URL", severity: "error" };
    }
    return null;
  },
  uuid: () => (value) => {
    if (typeof value === "string" && value && !UUID_REGEX.test(value)) {
      return { field: "", errorCode: "INVALID_UUID" /* INVALID_UUID */, message: "Invalid UUID", severity: "error" };
    }
    return null;
  },
  date: () => (value) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { field: "", errorCode: "INVALID_DATE" /* INVALID_DATE */, message: "Invalid date", severity: "error" };
      }
    }
    return null;
  },
  future: () => (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime()) || date <= /* @__PURE__ */ new Date()) {
      return { field: "", errorCode: "FUTURE_DATE" /* FUTURE_DATE */, message: "Date must be in the future", severity: "error" };
    }
    return null;
  }
};

// validation/rules/pattern.ts
var PatternRules = {
  matches: (regex) => (value) => {
    if (typeof value === "string" && !regex.test(value)) {
      return { field: "", errorCode: "PATTERN_MISMATCH" /* PATTERN_MISMATCH */, message: "Value does not match required pattern", severity: "error" };
    }
    return null;
  },
  contains: (substring) => (value) => {
    if (typeof value === "string" && !value.includes(substring)) {
      return { field: "", errorCode: "PATTERN_MISMATCH" /* PATTERN_MISMATCH */, message: `Value must contain "${substring}"`, severity: "error" };
    }
    return null;
  },
  customRule: (predicate, msg) => (value) => {
    if (!predicate(value)) {
      return { field: "", errorCode: "CUSTOM_ERROR" /* CUSTOM_ERROR */, message: msg, severity: "error" };
    }
    return null;
  }
};

// validation/rules/crossField.ts
var CrossFieldRules = {
  /**
   * Checks if the value equals another field in the root object (e.g. confirmPassword)
   */
  matchesField: (otherFieldName, label) => (value, ctx, rootData) => {
    if (rootData && rootData[otherFieldName] !== value) {
      return {
        field: "",
        errorCode: "CROSS_FIELD_INVALID" /* CROSS_FIELD_INVALID */,
        message: `Value must match ${label || otherFieldName}`,
        severity: "error",
        params: { otherField: otherFieldName }
      };
    }
    return null;
  },
  requiredIf: (otherFieldName, expectedValue) => (value, ctx, rootData) => {
    if (rootData && rootData[otherFieldName] === expectedValue) {
      if (value === void 0 || value === null || value === "") {
        return {
          field: "",
          errorCode: "MISSING_REQUIRED" /* MISSING_REQUIRED */,
          message: `Field is required when ${otherFieldName} is ${expectedValue}`,
          severity: "error"
        };
      }
    }
    return null;
  }
};
var BusinessRules = {
  allowedDomains: (domains) => (value) => {
    if (typeof value === "string") {
      const domain = value.split("@")[1];
      if (domain && !domains.includes(domain)) {
        return { field: "", errorCode: "CUSTOM_ERROR" /* CUSTOM_ERROR */, message: `Email domain must be one of: ${domains.join(", ")}`, severity: "error" };
      }
    }
    return null;
  },
  // Example context-aware rule
  adminOnly: () => (value, ctx) => {
    if (ctx?.userRole !== "admin") {
      return { field: "", errorCode: "SECURITY_RISK" /* SECURITY_RISK */, message: "This field is restricted to admins", severity: "error" };
    }
    return null;
  }
};

// validation/core/Validator.ts
var Validator = class {
  rules = [];
  fieldName;
  constructor(fieldName = "field") {
    this.fieldName = fieldName;
  }
  // --- Core API ---
  // Add a generic rule
  addRule(rule) {
    this.rules.push(rule);
    return this;
  }
  /**
   * Run all validations.
   */
  async run(value, context = {}, rootData = {}) {
    const errors = [];
    for (const rule of this.rules) {
      try {
        const result = await rule(value, context, rootData);
        if (result) {
          if (Array.isArray(result)) {
            result.forEach((e) => {
              e.field = e.field || this.fieldName;
            });
            errors.push(...result);
          } else {
            result.field = result.field || this.fieldName;
            errors.push(result);
          }
        }
      } catch (e) {
        errors.push({
          field: this.fieldName,
          errorCode: "CUSTOM_ERROR" /* CUSTOM_ERROR */,
          message: `Validation execution failed: ${e.message}`,
          severity: "error"
        });
      }
    }
    return errors.length === 0 ? successResult() : failureResult(errors);
  }
  // --- Extensibility helper ---
  custom(fn) {
    return this.addRule(fn);
  }
  // --- Fluent API ---
  // Primitives
  required() {
    return this.addRule(Rules.required());
  }
  notNull() {
    return this.addRule(Rules.notNull());
  }
  string() {
    return this.addRule(Rules.isString());
  }
  number() {
    return this.addRule(Rules.isNumber());
  }
  min(min) {
    return this.addRule(Rules.min(min));
  }
  max(max) {
    return this.addRule(Rules.max(max));
  }
  // Format
  email() {
    return this.addRule(FormatRules.email());
  }
  url() {
    return this.addRule(FormatRules.url());
  }
  uuid() {
    return this.addRule(FormatRules.uuid());
  }
  date() {
    return this.addRule(FormatRules.date());
  }
  future() {
    return this.addRule(FormatRules.future());
  }
  // Pattern
  matches(regex) {
    return this.addRule(PatternRules.matches(regex));
  }
  contains(str) {
    return this.addRule(PatternRules.contains(str));
  }
  // Cross-Field
  matchField(field, label) {
    return this.addRule(CrossFieldRules.matchesField(field, label));
  }
  requiredIf(field, val) {
    return this.addRule(CrossFieldRules.requiredIf(field, val));
  }
  // Business
  allowedDomains(domains) {
    return this.addRule(BusinessRules.allowedDomains(domains));
  }
  adminOnly() {
    return this.addRule(BusinessRules.adminOnly());
  }
  // Context Aware
  // Async Helper
  unique(checkFn) {
    return this.addRule(async (val) => {
      if (val && !await checkFn(val)) {
        return { field: "", errorCode: "ASYNC_VALIDATION_FAILED" /* ASYNC_VALIDATION_FAILED */, message: "Value must be unique", severity: "error" };
      }
      return null;
    });
  }
  // Context Aware generic
  withContext(checkFn, msg = "Context check failed") {
    return this.addRule((val, ctx) => {
      if (ctx && !checkFn(ctx, val)) {
        return { field: "", errorCode: "CUSTOM_ERROR" /* CUSTOM_ERROR */, message: msg, severity: "error" };
      }
      return null;
    });
  }
};

// validation/core/SchemaValidator.ts
var SchemaValidator = class {
  schema;
  constructor(schema) {
    this.schema = schema;
  }
  async run(data, context = {}) {
    const allErrors = [];
    for (const key of Object.keys(this.schema)) {
      const validator = this.schema[key];
      const value = data[key];
      if (validator) {
        const result = await validator.run(value, context, data);
        if (!result.valid) {
          result.errors.forEach((err) => {
            if (!err.field) err.field = String(key);
          });
          allErrors.push(...result.errors);
        }
      }
    }
    return allErrors.length === 0 ? successResult() : failureResult(allErrors);
  }
};
function createSchema(schema) {
  return new SchemaValidator(schema);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BusinessRules,
  CrossFieldRules,
  ErrorCode,
  FormatRules,
  PatternRules,
  Rules,
  SchemaValidator,
  Validator,
  createSchema,
  failureResult,
  successResult
});
