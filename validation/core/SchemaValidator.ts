import { Validator } from './Validator';
import { ValidationResult, successResult, failureResult } from './ValidationResult';
import { ValidationError } from './ErrorCodes';
import { ValidationContext } from './ValidationContext';

export type ValidationSchema<T> = Partial<Record<keyof T, Validator<any>>>;

export class SchemaValidator<T> {
    private schema: ValidationSchema<T>;

    constructor(schema: ValidationSchema<T>) {
        this.schema = schema;
    }

    public async run(data: T, context: ValidationContext = {}): Promise<ValidationResult> {
        const allErrors: ValidationError[] = [];

        for (const key of Object.keys(this.schema) as (keyof T)[]) {
            const validator = this.schema[key];
            const value = data[key];

            if (validator) {
                // Run validator with rootData set to the full object for cross-field checks
                const result = await validator.run(value, context, data);
                if (!result.valid) {
                    // Ensure fields are correctly named if not already
                    result.errors.forEach(err => {
                        if (!err.field) err.field = String(key);
                    });
                    allErrors.push(...result.errors);
                }
            }
        }

        return allErrors.length === 0 ? successResult() : failureResult(allErrors);
    }
}

// Function helper
export function createSchema<T>(schema: ValidationSchema<T>): SchemaValidator<T> {
    return new SchemaValidator(schema);
}
