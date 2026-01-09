import { ValidationError } from './ErrorCodes';

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export const successResult = (): ValidationResult => ({
    valid: true,
    errors: [],
});

export const failureResult = (errors: ValidationError[]): ValidationResult => ({
    valid: false,
    errors,
});
