import { ErrorCode, ValidationError, Severity } from './ErrorCodes';
import { ValidationResult, successResult, failureResult } from './ValidationResult';
import { ValidationContext } from './ValidationContext';

// Basic type for a validation function (rule)
// Returns null if valid, or a ValidationError (or array of them) if invalid.
// Can be async.
export type ValidationRule<T = any> = (
    value: T,
    context?: ValidationContext,
    rootData?: any
) => Promise<ValidationError | ValidationError[] | null> | ValidationError | ValidationError[] | null;

export class Validator<T = any> {
    private rules: ValidationRule<T>[] = [];
    private fieldName: string;

    constructor(fieldName: string = 'field') {
        this.fieldName = fieldName;
    }

    // --- Core API ---

    // Add a generic rule
    public addRule(rule: ValidationRule<T>): this {
        this.rules.push(rule);
        return this;
    }


    /**
     * Run all validations.
     */
    public async run(value: T, context: ValidationContext = {}, rootData: any = {}): Promise<ValidationResult> {
        const errors: ValidationError[] = [];

        for (const rule of this.rules) {
            try {
                const result = await rule(value, context, rootData);
                if (result) {
                    if (Array.isArray(result)) {
                        result.forEach(e => { e.field = e.field || this.fieldName; });
                        errors.push(...result);
                    } else {
                        result.field = result.field || this.fieldName;
                        errors.push(result);
                    }
                }
            } catch (e) {
                errors.push({
                    field: this.fieldName,
                    errorCode: ErrorCode.CUSTOM_ERROR,
                    message: `Validation execution failed: ${(e as Error).message}`,
                    severity: 'error'
                });
            }
        }

        return errors.length === 0 ? successResult() : failureResult(errors);
    }

    // --- Extensibility helper ---

    public custom(fn: ValidationRule<T>): this {
        return this.addRule(fn);
    }

    // --- Fluent API ---

    // Primitives
    public required(): this { return this.addRule(Rules.required()); }
    public notNull(): this { return this.addRule(Rules.notNull()); }
    public string(): this { return this.addRule(Rules.isString()); }
    public number(): this { return this.addRule(Rules.isNumber()); }
    public min(min: number): this { return this.addRule(Rules.min(min)); }
    public max(max: number): this { return this.addRule(Rules.max(max)); }

    // Format
    public email(): this { return this.addRule(FormatRules.email()); }
    public url(): this { return this.addRule(FormatRules.url()); }
    public uuid(): this { return this.addRule(FormatRules.uuid()); }
    public date(): this { return this.addRule(FormatRules.date()); }
    public future(): this { return this.addRule(FormatRules.future()); }

    // Pattern
    public matches(regex: RegExp): this { return this.addRule(PatternRules.matches(regex)); }
    public contains(str: string): this { return this.addRule(PatternRules.contains(str)); }

    // Cross-Field
    public matchField(field: string, label?: string): this { return this.addRule(CrossFieldRules.matchesField(field, label)); }
    public requiredIf(field: string, val: any): this { return this.addRule(CrossFieldRules.requiredIf(field, val)); }

    // Business
    public allowedDomains(domains: string[]): this { return this.addRule(BusinessRules.allowedDomains(domains)); }
    public adminOnly(): this { return this.addRule(BusinessRules.adminOnly()); } // Context Aware

    // Async Helper
    public unique(checkFn: (val: T) => Promise<boolean>): this {
        return this.addRule(async (val) => {
            if (val && !await checkFn(val)) {
                return { field: '', errorCode: ErrorCode.ASYNC_VALIDATION_FAILED, message: 'Value must be unique', severity: 'error' };
            }
            return null;
        });
    }

    // Context Aware generic
    public withContext(checkFn: (ctx: ValidationContext, val: T) => boolean, msg: string = 'Context check failed'): this {
        return this.addRule((val, ctx) => {
            if (ctx && !checkFn(ctx, val)) {
                return { field: '', errorCode: ErrorCode.CUSTOM_ERROR, message: msg, severity: 'error' };
            }
            return null;
        });
    }
}

// Chainable helpers to be populated by mixins or extensions
// (We'll implement actual rule methods via extensions/mixins or directly here if preferred for Typescript inference)

// -- Primitive Rules Helpers (We will add implementation in the main class for better TS support without mixin complexity) --

// Note: Detailed implementation of specific rules will be added in separate files 
// and attached to prototype or we can keep the class definition clean and use `addRule`.
// For the best DX in TypeScript, explicitly defining methods here is often better than dynamic mixins.
// I will define the standard methods here that delegate to the specific rule implementations.

import { Rules } from '../rules/primitive';
import { FormatRules } from '../rules/format';
import { PatternRules } from '../rules/pattern';
import { CrossFieldRules, BusinessRules } from '../rules/crossField';
