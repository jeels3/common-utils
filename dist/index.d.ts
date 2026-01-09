declare enum ErrorCode {
    REQUIRED = "REQUIRED",
    NOT_NULL = "NOT_NULL",
    NOT_EMPTY = "NOT_EMPTY",
    INVALID_TYPE = "INVALID_TYPE",
    MIN_VALUE = "MIN_VALUE",
    MAX_VALUE = "MAX_VALUE",
    RANGE = "RANGE",
    MIN_LENGTH = "MIN_LENGTH",
    MAX_LENGTH = "MAX_LENGTH",
    LENGTH_RANGE = "LENGTH_RANGE",
    INVALID_FORMAT = "INVALID_FORMAT",
    PATTERN_MISMATCH = "PATTERN_MISMATCH",
    CONTAINS_FORBIDDEN = "CONTAINS_FORBIDDEN",
    MISSING_REQUIRED = "MISSING_REQUIRED",
    CROSS_FIELD_INVALID = "CROSS_FIELD_INVALID",
    CUSTOM_ERROR = "CUSTOM_ERROR",
    ASYNC_VALIDATION_FAILED = "ASYNC_VALIDATION_FAILED",
    SECURITY_RISK = "SECURITY_RISK",
    CONTENT_POLICY = "CONTENT_POLICY",
    INVALID_EMAIL = "INVALID_EMAIL",
    INVALID_PHONE = "INVALID_PHONE",
    INVALID_URL = "INVALID_URL",
    INVALID_UUID = "INVALID_UUID",
    INVALID_IP = "INVALID_IP",
    INVALID_DATE = "INVALID_DATE",
    PAST_DATE = "PAST_DATE",
    FUTURE_DATE = "FUTURE_DATE"
}
type Severity = 'error' | 'warning' | 'info';
interface ValidationError {
    field: string;
    errorCode: ErrorCode | string;
    message: string;
    severity: Severity;
    params?: Record<string, any>;
}

interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
declare const successResult: () => ValidationResult;
declare const failureResult: (errors: ValidationError[]) => ValidationResult;

interface ValidationContext {
    userRole?: string;
    endpoint?: string;
    environment?: string;
    [key: string]: any;
}

type ValidationRule<T = any> = (value: T, context?: ValidationContext, rootData?: any) => Promise<ValidationError | ValidationError[] | null> | ValidationError | ValidationError[] | null;
declare class Validator<T = any> {
    private rules;
    private fieldName;
    constructor(fieldName?: string);
    addRule(rule: ValidationRule<T>): this;
    /**
     * Run all validations.
     */
    run(value: T, context?: ValidationContext, rootData?: any): Promise<ValidationResult>;
    custom(fn: ValidationRule<T>): this;
    required(): this;
    notNull(): this;
    string(): this;
    number(): this;
    min(min: number): this;
    max(max: number): this;
    email(): this;
    url(): this;
    uuid(): this;
    date(): this;
    future(): this;
    matches(regex: RegExp): this;
    contains(str: string): this;
    matchField(field: string, label?: string): this;
    requiredIf(field: string, val: any): this;
    allowedDomains(domains: string[]): this;
    adminOnly(): this;
    unique(checkFn: (val: T) => Promise<boolean>): this;
    withContext(checkFn: (ctx: ValidationContext, val: T) => boolean, msg?: string): this;
}

declare const Rules: {
    required: () => ValidationRule;
    notNull: () => ValidationRule;
    isString: () => ValidationRule;
    isNumber: () => ValidationRule;
    min: (min: number) => ValidationRule;
    max: (max: number) => ValidationRule;
};

declare const FormatRules: {
    email: () => ValidationRule;
    url: () => ValidationRule;
    uuid: () => ValidationRule;
    date: () => ValidationRule;
    future: () => ValidationRule;
};

declare const PatternRules: {
    matches: (regex: RegExp) => ValidationRule;
    contains: (substring: string) => ValidationRule;
    customRule: (predicate: (val: any) => boolean, msg: string) => ValidationRule;
};

declare const CrossFieldRules: {
    /**
     * Checks if the value equals another field in the root object (e.g. confirmPassword)
     */
    matchesField: (otherFieldName: string, label?: string) => ValidationRule;
    requiredIf: (otherFieldName: string, expectedValue: any) => ValidationRule;
};
declare const BusinessRules: {
    allowedDomains: (domains: string[]) => ValidationRule;
    adminOnly: () => ValidationRule;
};

export { BusinessRules, CrossFieldRules, ErrorCode, FormatRules, PatternRules, Rules, type Severity, type ValidationContext, type ValidationError, type ValidationResult, type ValidationRule, Validator, failureResult, successResult };
